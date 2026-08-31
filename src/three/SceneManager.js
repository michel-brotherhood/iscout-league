import * as THREE from 'three';

/**
 * iSCOUT — football stadium scene (the visual protagonist).
 * A single 3D pitch inside a stadium; the camera travels through it as the user
 * scrolls, telling VÍDEO → VISÃO → DADOS → DECISÃO. Everything is procedural
 * (canvas-drawn pitch texture, instanced crowd/players) — no external assets.
 */

const PITCH_W = 105; // x
const PITCH_H = 68;  // z

// ---------- canvas-drawn pitch (grass stripes + full markings) ----------
function makePitchTexture() {
  const W = 2048, H = Math.round(2048 * (PITCH_H / PITCH_W));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  // mown stripes
  const stripes = 18, sw = W / stripes;
  for (let i = 0; i < stripes; i++) {
    x.fillStyle = i % 2 ? '#268a4b' : '#2f9c56';
    x.fillRect(i * sw, 0, sw, H);
  }
  // markings
  const m = W * 0.045;               // outer margin
  const lw = Math.max(3, W * 0.0028);
  x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = lw; x.fillStyle = 'rgba(255,255,255,.85)';
  const L = m, R = W - m, T = m, B = H - m, MX = W / 2, MY = H / 2;
  x.strokeRect(L, T, R - L, B - T);                       // boundary
  x.beginPath(); x.moveTo(MX, T); x.lineTo(MX, B); x.stroke(); // halfway
  const cr = (B - T) * 0.15;
  x.beginPath(); x.arc(MX, MY, cr, 0, Math.PI * 2); x.stroke(); // center circle
  x.beginPath(); x.arc(MX, MY, lw * 1.6, 0, Math.PI * 2); x.fill(); // center spot
  // penalty + goal boxes both ends
  const paH = (B - T) * 0.6, paW = (R - L) * 0.16;
  const gaH = (B - T) * 0.3, gaW = (R - L) * 0.06;
  [[L, 1], [R, -1]].forEach(([ex, dir]) => {
    x.strokeRect(ex, MY - paH / 2, paW * dir, paH);       // penalty area
    x.strokeRect(ex, MY - gaH / 2, gaW * dir, gaH);       // goal area
    const spot = ex + dir * paW * 0.66;
    x.beginPath(); x.arc(spot, MY, lw * 1.4, 0, Math.PI * 2); x.fill(); // penalty spot
    x.beginPath(); x.arc(spot, MY, cr * 0.9, -Math.PI * 0.42 * dir + (dir < 0 ? Math.PI : 0), Math.PI * 0.42 * dir + (dir < 0 ? Math.PI : 0)); x.stroke(); // arc (approx)
  });
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 8; tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBallTexture() {
  const S = 512, c = document.createElement('canvas'); c.width = c.height = S;
  const x = c.getContext('2d');
  x.fillStyle = '#f4f7f6'; x.fillRect(0, 0, S, S);
  // scattered black pentagons (stylized)
  x.fillStyle = '#0b1c30';
  const pts = [[.5, .18], [.2, .4], [.8, .4], [.35, .72], [.68, .72], [.5, .5]];
  pts.forEach(([px, py]) => {
    const cx = px * S, cy = py * S, r = S * 0.085;
    x.beginPath();
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * (Math.PI * 2 / 5); const xx = cx + Math.cos(a) * r, yy = cy + Math.sin(a) * r; i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
    x.closePath(); x.fill();
  });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export default class SceneManager {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas; this.reducedMotion = reducedMotion;
    this.state = { progress: 0 };
    this._raf = null; this._clock = new THREE.Clock();
    this._mobile = matchMedia('(max-width:820px)').matches;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.dpr = Math.min(devicePixelRatio, this._mobile ? 1.25 : 1.5);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#04101f');
    this.scene.fog = new THREE.Fog('#062036', 150, 520);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.5, 800);
    this.camera.position.set(0, 5, 78);

    this._lights();
    this._pitch();
    this._stadium();
    this._players();
    this._ball();
    this._overlays();

    this._onResize(); addEventListener('resize', () => this._onResize());
    document.addEventListener('visibilitychange', () => document.hidden ? this.pause() : this.start());
  }

  _lights() {
    this.scene.add(new THREE.HemisphereLight('#9cc4ff', '#0c241a', 0.85));
    const key = new THREE.DirectionalLight('#f2f9ff', 1.5); key.position.set(50, 100, 40); this.scene.add(key);
    const fill = new THREE.DirectionalLight('#cfe6ff', 0.7); fill.position.set(0, 50, 90); this.scene.add(fill);
    const rim = new THREE.DirectionalLight('#47c6ff', 0.6); rim.position.set(-50, 40, -50); this.scene.add(rim);
  }

  _pitch() {
    const g = new THREE.PlaneGeometry(PITCH_W, PITCH_H);
    this.pitchTex = makePitchTexture();
    const m = new THREE.MeshStandardMaterial({ map: this.pitchTex, roughness: 0.95, metalness: 0 });
    this.pitch = new THREE.Mesh(g, m); this.pitch.rotation.x = -Math.PI / 2; this.scene.add(this.pitch);
    // dark ground beyond pitch
    const gg = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: '#061525', roughness: 1 }));
    gg.rotation.x = -Math.PI / 2; gg.position.y = -0.05; this.scene.add(gg);
  }

  _stadium() {
    const g = new THREE.Group(); this.scene.add(g);
    const standMat = new THREE.MeshStandardMaterial({ color: '#0a1a2e', roughness: 1 });
    // four raked stands
    // upright perimeter stands (dark backing; crowd tiers give the raked look)
    const mk = (w, d, px, pz, rot) => {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 14, d), standMat);
      s.position.set(px, 5, pz); s.rotation.y = rot; g.add(s); return s;
    };
    const near = 14; // inner edge of stand from touchline (kept clear so it never blocks the pitch)
    mk(PITCH_W + 44, 26, 0, -(PITCH_H / 2 + near + 13), 0);
    mk(PITCH_W + 44, 26, 0, (PITCH_H / 2 + near + 13), 0);
    mk(PITCH_H + 24, 26, -(PITCH_W / 2 + near + 13), 0, Math.PI / 2);
    mk(PITCH_H + 24, 26, (PITCH_W / 2 + near + 13), 0, Math.PI / 2);

    // crowd packed as a rising band on the stands (bright specks)
    const cN = this._mobile ? 2200 : 5200;
    const cg = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const cm = new THREE.MeshBasicMaterial({ vertexColors: true });
    this.crowd = new THREE.InstancedMesh(cg, cm, cN);
    const o = new THREE.Object3D(); const col = new THREE.Color();
    const pal = ['#7fa8d8', '#9fc4e6', '#b9c6d8', '#dfe8f2', '#8fd0e6', '#c9d9a8', '#5f89c0'];
    const HW = PITCH_W / 2, HH = PITCH_H / 2;
    for (let i = 0; i < cN; i++) {
      const side = i % 4;
      const along = (Math.random() - 0.5) * 0.98;
      const tier = Math.random();               // 0 inner/low → 1 outer/high (raked)
      const inset = near + 1 + tier * 22;        // distance out from touchline
      const y = 2 + tier * 13;                   // rise with tier
      let px, pz;
      if (side === 0) { px = along * (PITCH_W + 40); pz = -(HH + inset); }
      else if (side === 1) { px = along * (PITCH_W + 40); pz = (HH + inset); }
      else if (side === 2) { pz = along * (PITCH_H + 20); px = -(HW + inset); }
      else { pz = along * (PITCH_H + 20); px = (HW + inset); }
      o.position.set(px, y, pz); o.updateMatrix();
      this.crowd.setMatrixAt(i, o.matrix);
      col.set(pal[(Math.random() * pal.length) | 0]); this.crowd.setColorAt(i, col);
    }
    this.crowd.instanceMatrix.needsUpdate = true;
    if (this.crowd.instanceColor) this.crowd.instanceColor.needsUpdate = true;
    g.add(this.crowd);

    // floodlight towers + glow
    this.floods = [];
    const corners = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    corners.forEach(([sx, sz]) => {
      const px = sx * (PITCH_W / 2 + 26), pz = sz * (PITCH_H / 2 + 24);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 34, 8), standMat);
      pole.position.set(px, 17, pz); g.add(pole);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 1), new THREE.MeshStandardMaterial({ color: '#0a1a2e', emissive: '#eaf6ff', emissiveIntensity: 1.4 }));
      panel.position.set(px, 33, pz); panel.lookAt(0, 0, 0); g.add(panel);
      const light = new THREE.PointLight('#dff0ff', 0.7, 260, 1.4); light.position.set(px, 33, pz); g.add(light);
      this.floods.push(panel);
    });
  }

  _players() {
    // two teams as instanced capsules (bodies) + spheres (heads)
    const positions = [];
    const form = [ // fractions of half-pitch; will mirror for team B
      [0.90, 0.0], [0.7, -0.28], [0.7, 0.28], [0.72, -0.62], [0.72, 0.62],
      [0.45, -0.18], [0.45, 0.18], [0.5, -0.55], [0.5, 0.55], [0.22, -0.3], [0.22, 0.3],
    ];
    const half = PITCH_W / 2;
    form.forEach(([fx, fz]) => positions.push([-fx * half * 0.92, fz * (PITCH_H / 2) * 0.9, 0]));
    form.forEach(([fx, fz]) => positions.push([fx * half * 0.92, fz * (PITCH_H / 2) * 0.9, 1]));
    this.playerPos = positions;
    this.heroIdx = 5; // a highlighted midfielder (team A)

    const N = positions.length;
    const bodyGeo = new THREE.CapsuleGeometry(0.7, 2.2, 4, 8);
    const headGeo = new THREE.SphereGeometry(0.62, 12, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.05 });
    const headMat = new THREE.MeshStandardMaterial({ roughness: 0.6, color: '#e7c9a0' });
    this.bodies = new THREE.InstancedMesh(bodyGeo, bodyMat, N);
    this.heads = new THREE.InstancedMesh(headGeo, headMat, N);
    const o = new THREE.Object3D(); const col = new THREE.Color();
    const teamA = new THREE.Color('#f2f5f4'), teamB = new THREE.Color('#122f4d'), hero = new THREE.Color('#47c6ff');
    positions.forEach((p, i) => {
      o.position.set(p[0], 2.2, p[1]); o.updateMatrix(); this.bodies.setMatrixAt(i, o.matrix);
      o.position.set(p[0], 4.2, p[1]); o.updateMatrix(); this.heads.setMatrixAt(i, o.matrix);
      col.copy(i === this.heroIdx ? hero : (p[2] === 0 ? teamA : teamB)); this.bodies.setColorAt(i, col);
    });
    this.bodies.instanceMatrix.needsUpdate = true; this.heads.instanceMatrix.needsUpdate = true;
    if (this.bodies.instanceColor) this.bodies.instanceColor.needsUpdate = true;
    this.scene.add(this.bodies); this.scene.add(this.heads);

    // tracking box around hero player
    const hp = positions[this.heroIdx];
    const box = new THREE.BoxGeometry(3.2, 6, 3.2);
    this.trackBox = new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({ color: '#47c6ff', transparent: true, opacity: 0 }));
    this.trackBox.position.set(hp[0], 3, hp[1]); this.scene.add(this.trackBox);
    this.trackHalo = new THREE.Mesh(new THREE.RingGeometry(3.4, 3.7, 40), new THREE.MeshBasicMaterial({ color: '#a8db37', transparent: true, opacity: 0, side: THREE.DoubleSide }));
    this.trackHalo.rotation.x = -Math.PI / 2; this.trackHalo.position.set(hp[0], 0.15, hp[1]); this.scene.add(this.trackHalo);
  }

  _ball() {
    this.ballTex = makeBallTexture();
    this.ball = new THREE.Mesh(new THREE.SphereGeometry(1.15, 32, 24), new THREE.MeshStandardMaterial({ map: this.ballTex, roughness: 0.35, metalness: 0.05 }));
    this.ball.position.set(-half0(), 1.15, 6); this.scene.add(this.ball);
    function half0() { return PITCH_W * 0.28; }
  }

  _overlays() {
    // data trajectories (revealed in data act)
    this.trails = new THREE.Group(); this.scene.add(this.trails);
    this.trailMat = new THREE.LineBasicMaterial({ color: '#47c6ff', transparent: true, opacity: 0 });
    for (let k = 0; k < 8; k++) {
      const p0 = this.playerPos[(Math.random() * this.playerPos.length) | 0];
      const pts = [];
      let cx = p0[0], cz = p0[1];
      for (let s = 0; s < 6; s++) { pts.push(new THREE.Vector3(cx, 0.3, cz)); cx += (Math.random() - 0.5) * 18; cz += (Math.random() - 0.5) * 14; }
      this.trails.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), this.trailMat));
    }
    // radar ring (matching)
    this.radar = new THREE.Mesh(new THREE.RingGeometry(1, 1.4, 64), new THREE.MeshBasicMaterial({ color: '#a8db37', transparent: true, opacity: 0, side: THREE.DoubleSide }));
    this.radar.rotation.x = -Math.PI / 2; this.radar.position.y = 0.2; this.scene.add(this.radar);
  }

  // camera keyframes across global progress: [p, px,py,pz, lx,ly,lz]
  _camFor(p) {
    const hp = this.playerPos[this.heroIdx];
    const K = [
      [0.00, -46, 44, 72, 2, -3, -6],   // hero — high cinematic broadcast, full pitch
      [0.08, -30, 38, 66, 0, -2, -6],
      [0.25, 0, 74, 34, 0, 0, 0],       // problem — high crane, all players
      [0.42, hp[0] + 13, 9, hp[1] + 16, hp[0], 2, hp[1]], // detection — dive to player
      [0.58, 0, 84, 0.1, 0, 0, 0],      // data — top-down tactical
      [0.75, 0, 50, 50, 0, 0, 0],       // matching — high angle
      [0.92, hp[0] + 11, 6, hp[1] + 18, hp[0], 3, hp[1]], // cta — near lit player
      [1.00, hp[0] + 9, 6, hp[1] + 16, hp[0], 2.5, hp[1]],
    ];
    let a = K[0], b = K[K.length - 1];
    for (let i = 0; i < K.length - 1; i++) if (p >= K[i][0] && p <= K[i + 1][0]) { a = K[i]; b = K[i + 1]; break; }
    const s = (b[0] - a[0]) || 1; let t = (p - a[0]) / s; t = t < 0 ? 0 : t > 1 ? 1 : t; t = t * t * (3 - 2 * t);
    const L = (i) => a[i] + (b[i] - a[i]) * t;
    return { px: L(1), py: L(2), pz: L(3), lx: L(4), ly: L(5), lz: L(6) };
  }

  setChapter() {} // chapters handled in DOM; scene stays the stadium

  _onResize() {
    const w = innerWidth, h = innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.dpr = Math.min(devicePixelRatio, this._mobile ? 1.25 : 1.5); this.renderer.setPixelRatio(this.dpr);
  }
  start() { if (!this._raf) this._loop(); }
  pause() { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; } }
  _loop() { this._raf = requestAnimationFrame(() => this._loop()); this.update(Math.min(this._clock.getDelta(), 0.05)); this.renderer.render(this.scene, this.camera); }

  _lerpO(op, target, dt) { return op + (target - op) * Math.min(1, dt * 3); }

  update(dt) {
    const p = this.state.progress;
    // ball spin + gentle bob
    this.ball.rotation.y += dt * 0.8; this.ball.rotation.x += dt * 0.3;
    this.ball.position.y = 1.15 + Math.sin(this._clock.elapsedTime * 1.5) * 0.15;
    this.ball.visible = p < 0.2 || p > 0.85;
    // floodlight flicker (subtle)
    // detection reveals
    const detect = sr(p, 0.36, 0.44) * (1 - sr(p, 0.52, 0.6));
    this.trackBox.material.opacity = this._lerpO(this.trackBox.material.opacity, detect, dt);
    this.trackHalo.material.opacity = this._lerpO(this.trackHalo.material.opacity, detect * 0.8, dt);
    this.trackBox.rotation.y += dt * 0.4;
    this.trackHalo.scale.setScalar(1 + Math.sin(this._clock.elapsedTime * 3) * 0.05);
    // data trails
    const data = sr(p, 0.52, 0.62) * (1 - sr(p, 0.7, 0.78));
    this.trailMat.opacity = this._lerpO(this.trailMat.opacity, data * 0.85, dt);
    // matching radar sweep
    const match = sr(p, 0.68, 0.78);
    this.radar.material.opacity = this._lerpO(this.radar.material.opacity, match * (1 - sr(p, 0.82, 0.88)) * 0.7, dt);
    const rs = 2 + ((this._clock.elapsedTime * 12) % 46);
    this.radar.scale.setScalar(match > 0.02 ? rs : 1);
    this.radar.material.opacity *= match > 0.02 ? Math.max(0, 1 - rs / 50) : 1;

    // camera
    const c = this.reducedMotion ? this._camFor(0) : this._camFor(p);
    const l = this.reducedMotion ? 1 : Math.min(1, dt * 2.2);
    this.camera.position.x += (c.px - this.camera.position.x) * l;
    this.camera.position.y += (c.py - this.camera.position.y) * l;
    this.camera.position.z += (c.pz - this.camera.position.z) * l;
    this._lx = (this._lx ?? c.lx) + (c.lx - (this._lx ?? c.lx)) * l;
    this._ly = (this._ly ?? c.ly) + (c.ly - (this._ly ?? c.ly)) * l;
    this._lz = (this._lz ?? c.lz) + (c.lz - (this._lz ?? c.lz)) * l;
    this.camera.lookAt(this._lx, this._ly, this._lz);
  }

  dispose() {
    this.pause();
    this.scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { const m = o.material; (Array.isArray(m) ? m : [m]).forEach((x) => { if (x.map) x.map.dispose(); x.dispose && x.dispose(); }); } });
    this.renderer.dispose();
  }
}

function sr(x, a, b) { if (b === a) return x >= b ? 1 : 0; let t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }
