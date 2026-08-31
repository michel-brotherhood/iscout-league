import * as THREE from 'three';

/**
 * Single persistent WebGL scene for the whole page.
 * One Points system morphs between a scattered "athlete cloud" and a top-down
 * "field" layout; a denser subset forms the hero "player". Camera keyframes and
 * visual state are driven by global scroll progress (0..1) + per-act progress.
 *
 * Everything is procedural — no external assets required.
 */

const COLORS = {
  navy: new THREE.Color('#04101f'),
  dim: new THREE.Color('#25506f'),
  cyan: new THREE.Color('#47c6ff'),
  lime: new THREE.Color('#a8db37'),
  white: new THREE.Color('#eaf6ff'),
  blue: new THREE.Color('#3d6bff'),
};

const vertexShader = /* glsl */ `
  attribute vec3 cloudPos;
  attribute vec3 fieldPos;
  attribute vec3 pColor;
  attribute float pSize;
  attribute float highlight;   // 0..1 detected/highlighted
  attribute float seed;
  uniform float uMorph;        // 0 cloud -> 1 field
  uniform float uTime;
  uniform float uReveal;       // global fade-in
  uniform float uVisible;      // 0..1 fraction visible (matching filter)
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vHi;

  void main() {
    vec3 pos = mix(cloudPos, fieldPos, uMorph);
    // subtle idle drift
    pos.x += sin(uTime * 0.3 + seed * 6.2831) * 0.05 * (1.0 - uMorph);
    pos.y += cos(uTime * 0.25 + seed * 6.2831) * 0.05 * (1.0 - uMorph);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float base = pSize * (210.0 / -mv.z) * uPixelRatio;
    gl_PointSize = clamp(base * (0.7 + highlight * 0.5), 0.0, 26.0);

    vColor = pColor;
    vHi = highlight;
    // filter: hide points whose seed exceeds visible fraction (keep highlighted)
    float keep = step(seed, uVisible);
    keep = max(keep, highlight);
    // depth fade so distant points melt into the background instead of stacking white
    float depthFade = smoothstep(-42.0, -6.0, mv.z);
    vAlpha = uReveal * keep * (0.10 + highlight * 0.34) * depthFade;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vHi;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float glow = pow(core, 2.2);
    vec3 col = vColor + vHi * 0.25;
    gl_FragColor = vec4(col, glow * vAlpha);
  }
`;

// ---- humanoid-ish point distribution for the "player" ----
function humanoidPoint(i, n) {
  // returns a point roughly within a standing figure silhouette
  const t = Math.random();
  const r = Math.random();
  const a = Math.random() * Math.PI * 2;
  let x, y, z;
  if (t < 0.14) { // head
    y = 1.55 + r * 0.28; const rr = 0.16 * Math.sqrt(r);
    x = Math.cos(a) * rr; z = Math.sin(a) * rr;
  } else if (t < 0.55) { // torso
    y = 0.55 + Math.random() * 0.95; const rr = 0.26 * (0.6 + 0.4 * Math.random());
    x = Math.cos(a) * rr * 0.9; z = Math.sin(a) * rr * 0.5;
  } else if (t < 0.78) { // legs
    const leg = Math.random() < 0.5 ? -1 : 1;
    y = Math.random() * 0.95; x = leg * 0.12 + (Math.random() - 0.5) * 0.14;
    z = (Math.random() - 0.5) * 0.16;
  } else { // arms
    const arm = Math.random() < 0.5 ? -1 : 1;
    y = 0.85 + Math.random() * 0.7; x = arm * (0.28 + Math.random() * 0.22);
    z = (Math.random() - 0.5) * 0.16;
  }
  return new THREE.Vector3(x, y, z);
}

export default class SceneManager {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.state = { progress: 0, acts: {} };
    this.chapter = 'dark';
    this._raf = null;
    this._clock = new THREE.Clock();

    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: true, alpha: true, powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.dpr = Math.min(window.devicePixelRatio, this._isMobile() ? 1.25 : 1.5);
    this.renderer.setPixelRatio(this.dpr);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x04101f, 0.03);

    this.camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200);
    this.camera.position.set(0, 1.1, 7);
    this.camera.lookAt(0, 0.9, 0);

    this.count = this._isMobile() ? 900 : 1600;
    this._buildPoints();
    this._buildBoundingBox();

    this._onResize();
    window.addEventListener('resize', () => this._onResize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause(); else this.start();
    });
  }

  _isMobile() { return window.matchMedia('(max-width: 820px)').matches; }

  _buildPoints() {
    const n = this.count;
    const cloud = new Float32Array(n * 3);
    const field = new Float32Array(n * 3);
    const color = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const highlight = new Float32Array(n);
    const seed = new Float32Array(n);

    const playerCount = Math.floor(n * 0.2); // subset forms the player

    for (let i = 0; i < n; i++) {
      const isPlayer = i < playerCount;
      let cx, cy, cz;
      if (isPlayer) {
        const p = humanoidPoint(i, playerCount);
        cx = p.x; cy = p.y; cz = p.z - 0.2;
      } else {
        // scattered athlete cloud in a wide volume
        const radius = 6 + Math.random() * 16;
        const ang = Math.random() * Math.PI * 2;
        cx = Math.cos(ang) * radius * (0.5 + Math.random() * 0.6);
        cy = (Math.random() - 0.3) * 6;
        cz = -3 - Math.random() * 26;
      }
      cloud[i * 3] = cx; cloud[i * 3 + 1] = cy; cloud[i * 3 + 2] = cz;

      // field layout: points spread on a plane (top-down pitch), player near centre
      let fx, fz;
      if (isPlayer) { fx = (Math.random() - 0.5) * 5; fz = (Math.random() - 0.5) * 4; }
      else { fx = (Math.random() - 0.5) * 22; fz = (Math.random() - 0.5) * 13; }
      field[i * 3] = fx;
      field[i * 3 + 1] = -0.02 + Math.random() * 0.05;
      field[i * 3 + 2] = fz;

      // color + highlight: few highlighted in cloud; player mostly bright
      let hi = 0;
      if (isPlayer) hi = 0.35 + Math.random() * 0.4;
      else if (Math.random() < 0.06) hi = 1.0;
      highlight[i] = hi;

      const base = isPlayer ? COLORS.cyan : (hi > 0.9 ? COLORS.lime : COLORS.dim);
      const c = base.clone().lerp(COLORS.white, isPlayer ? 0.15 : hi * 0.4);
      color[i * 3] = c.r; color[i * 3 + 1] = c.g; color[i * 3 + 2] = c.b;

      size[i] = (isPlayer ? 3.4 : 2.2) * (0.55 + Math.random() * 0.7);
      seed[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(cloud.slice(), 3));
    geo.setAttribute('cloudPos', new THREE.BufferAttribute(cloud, 3));
    geo.setAttribute('fieldPos', new THREE.BufferAttribute(field, 3));
    geo.setAttribute('pColor', new THREE.BufferAttribute(color, 3));
    geo.setAttribute('pSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('highlight', new THREE.BufferAttribute(highlight, 1));
    geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1));

    this.uniforms = {
      uMorph: { value: 0 },
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uVisible: { value: 1 },
      uPixelRatio: { value: this.dpr },
    };
    this.pointsMat = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, uniforms: this.uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    this.points = new THREE.Points(geo, this.pointsMat);
    this.playerCount = playerCount;
    this.scene.add(this.points);

    // faint field lines (revealed in data act)
    this.field = this._buildField();
    this.scene.add(this.field);
  }

  _buildField() {
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0x2a6f8f, transparent: true, opacity: 0 });
    const w = 22, h = 13;
    const rect = (x, z, rw, rh) => {
      const pts = [
        new THREE.Vector3(x - rw / 2, 0, z - rh / 2), new THREE.Vector3(x + rw / 2, 0, z - rh / 2),
        new THREE.Vector3(x + rw / 2, 0, z + rh / 2), new THREE.Vector3(x - rw / 2, 0, z + rh / 2),
        new THREE.Vector3(x - rw / 2, 0, z - rh / 2),
      ];
      return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    };
    g.add(rect(0, 0, w, h));
    g.add(rect(0, 0, 3, 6));
    const mid = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, -h / 2), new THREE.Vector3(0, 0, h / 2),
    ]), mat);
    g.add(mid);
    const circlePts = [];
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; circlePts.push(new THREE.Vector3(Math.cos(a) * 2, 0, Math.sin(a) * 2)); }
    const circle = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePts), mat);
    g.add(circle);
    this.fieldMat = mat;
    g.rotation.x = 0; // lies on XZ plane
    return g;
  }

  _buildBoundingBox() {
    const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(0.9, 1.9, 0.9));
    this.boxMat = new THREE.LineBasicMaterial({ color: 0x47c6ff, transparent: true, opacity: 0 });
    this.box = new THREE.LineSegments(geo, this.boxMat);
    this.box.position.set(0, 0.9, -0.2);
    this.scene.add(this.box);

    // crosshair corners feel — small tick using a second slightly larger box
    const g2 = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.1, 2.1, 1.1));
    this.boxMat2 = new THREE.LineBasicMaterial({ color: 0xa8db37, transparent: true, opacity: 0 });
    this.box2 = new THREE.LineSegments(g2, this.boxMat2);
    this.box2.position.copy(this.box.position);
    this.scene.add(this.box2);
  }

  setChapter(chapter) {
    this.chapter = chapter;
    // blending: additive glow reads best on dark; keep additive but lower reveal handled by CSS bg
    if (this.scene.fog) {
      this.scene.fog.color.set(chapter === 'light' ? 0xdfe7e4 : 0x04101f);
      this.scene.fog.density = chapter === 'light' ? 0.03 : 0.02;
    }
  }

  // ---- camera keyframes across global progress ----
  _cameraFor(p) {
    // keyframes: [progress, posX, posY, posZ, lookY]
    const K = [
      [0.00, 0.9, 1.2, 8.0, 0.9],   // hero — near player
      [0.16, 0.0, 0.6, 13.0, 0.2],  // problem — travel into cloud
      [0.34, 0.4, 1.0, 6.0, 0.9],   // pipeline — back to player, detect
      [0.42, 0.5, 1.1, 4.2, 0.9],   // zoom detected
      [0.58, 0.0, 9.5, 0.2, 0.0],   // data — top-down field
      [0.74, 0.0, 7.0, 3.0, 0.0],   // matching — high angle over field
      [0.90, 0.5, 1.1, 5.5, 0.9],   // cta — player restored
      [1.00, 0.4, 1.0, 5.0, 0.9],
    ];
    let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) {
      if (p >= K[i][0] && p <= K[i + 1][0]) { a = K[i]; b = K[i + 1]; break; }
    }
    const span = (b[0] - a[0]) || 1;
    let t = (p - a[0]) / span;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    t = t * t * (3 - 2 * t); // smoothstep
    return {
      x: a[1] + (b[1] - a[1]) * t,
      y: a[2] + (b[2] - a[2]) * t,
      z: a[3] + (b[3] - a[3]) * t,
      ly: a[4] + (b[4] - a[4]) * t,
    };
  }

  _onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dpr = Math.min(window.devicePixelRatio, this._isMobile() ? 1.25 : 1.5);
    this.renderer.setPixelRatio(this.dpr);
    if (this.uniforms) this.uniforms.uPixelRatio.value = this.dpr;
  }

  start() { if (!this._raf) this._loop(); }
  pause() { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; } }

  _loop() {
    this._raf = requestAnimationFrame(() => this._loop());
    const dt = Math.min(this._clock.getDelta(), 0.05);
    this.update(dt);
    this.renderer.render(this.scene, this.camera);
  }

  update(dt) {
    const p = this.state.progress;
    const u = this.uniforms;
    u.uTime.value += dt;

    // reveal fade-in
    u.uReveal.value += (1 - u.uReveal.value) * Math.min(1, dt * 2.5);

    // morph cloud->field ramps through the data act (~0.5..0.66)
    const morph = smoothRange(p, 0.5, 0.64);
    u.uMorph.value += (morph - u.uMorph.value) * Math.min(1, dt * 3);

    // field lines opacity in data + matching
    const fieldOp = smoothRange(p, 0.5, 0.6) * (1 - smoothRange(p, 0.82, 0.9));
    this.fieldMat.opacity += (fieldOp * 0.5 - this.fieldMat.opacity) * Math.min(1, dt * 3);

    // matching filter: visible fraction 1 -> 0.02 during matching act (~0.66..0.8)
    const filt = 1 - smoothRange(p, 0.68, 0.8) * 0.98;
    u.uVisible.value += (filt - u.uVisible.value) * Math.min(1, dt * 3);

    // bounding box appears during detection (~0.36..0.46), fades after
    const boxOp = smoothRange(p, 0.36, 0.42) * (1 - smoothRange(p, 0.48, 0.56));
    this.boxMat.opacity += (boxOp * 0.9 - this.boxMat.opacity) * Math.min(1, dt * 4);
    this.boxMat2.opacity += (boxOp * 0.5 - this.boxMat2.opacity) * Math.min(1, dt * 4);
    if (boxOp > 0.01) {
      this.box.rotation.y += dt * 0.2;
      this.box2.rotation.y -= dt * 0.15;
    }

    // camera
    const cam = this.reducedMotion ? this._cameraFor(0) : this._cameraFor(p);
    const l = this.reducedMotion ? 1 : Math.min(1, dt * 2.4);
    this.camera.position.x += (cam.x - this.camera.position.x) * l;
    this.camera.position.y += (cam.y - this.camera.position.y) * l;
    this.camera.position.z += (cam.z - this.camera.position.z) * l;
    this._lookY = (this._lookY ?? cam.ly) + (cam.ly - (this._lookY ?? cam.ly)) * l;
    this.camera.lookAt(0, this._lookY, this.uniforms.uMorph.value > 0.5 ? 0 : 0);
  }

  dispose() {
    this.pause();
    this.points.geometry.dispose();
    this.pointsMat.dispose();
    this.box.geometry.dispose(); this.boxMat.dispose();
    this.box2.geometry.dispose(); this.boxMat2.dispose();
    this.field.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.fieldMat.dispose();
    this.renderer.dispose();
  }
}

function smoothRange(x, a, b) {
  if (b === a) return x >= b ? 1 : 0;
  let t = (x - a) / (b - a);
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  return t * t * (3 - 2 * t);
}
