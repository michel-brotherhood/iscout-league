import './styles/main.css';
import SceneManager from './three/SceneManager.js';
import ScrollManager from './motion/ScrollManager.js';
import { initReveals } from './motion/reveal.js';
import { initDialogs } from './lib/contactForm.js';
import { initI18n } from './lib/i18n.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const state = { progress: 0, acts: {} };

function boot() {
  // ---- Header behaviour ----
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('[data-burger]');
  const nav = document.querySelector('.site-header__nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', String(open));
      nav.style.display = open ? 'flex' : '';
      if (open) {
        Object.assign(nav.style, {
          position: 'fixed', inset: '64px 0 auto 0', flexDirection: 'column',
          gap: '1.2rem', padding: '1.5rem var(--gutter)', background: 'var(--bg-elev)',
          borderBottom: '1px solid var(--line)', zIndex: '25',
        });
      } else { nav.style = ''; }
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      if (header.classList.contains('nav-open')) burger.click();
    }));
  }

  // ---- WebGL ----
  let scene = null;
  const canvas = document.getElementById('webgl');
  try {
    scene = new SceneManager(canvas, { reducedMotion });
    scene.state = state;
    scene.start();
  } catch (err) {
    console.warn('WebGL unavailable — DOM experience only.', err);
    canvas.style.display = 'none';
  }

  // ---- Scroll + reveals ----
  const scroll = new ScrollManager({
    state, reducedMotion,
    onChapter: (c) => scene && scene.setChapter(c),
  });
  initReveals({ reducedMotion });

  // ---- Dialogs + i18n ----
  initDialogs();
  initI18n();

  // recalc after fonts/layout settle
  window.addEventListener('load', () => scroll.refresh());
  requestAnimationFrame(() => scroll.refresh());
}

// ---- Loader ----
function runLoader(done) {
  const loader = document.getElementById('loader');
  const count = loader ? loader.querySelector('[data-count]') : null;
  if (!loader || reducedMotion) { loader && loader.classList.add('is-done'); done(); return; }
  let v = 0;
  const steps = [0, 23, 47, 82, 100];
  let i = 0;
  const tick = () => {
    v = steps[i];
    count.textContent = String(v).padStart(2, '0');
    i++;
    if (i < steps.length) setTimeout(tick, 220);
    else setTimeout(() => { loader.classList.add('is-done'); done(); }, 380);
  };
  tick();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => runLoader(boot));
} else {
  runLoader(boot);
}
