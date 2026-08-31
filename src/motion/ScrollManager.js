import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll integrated with GSAP ScrollTrigger.
 * Exposes a shared `state.progress` (0..1 over the whole document) that the
 * WebGL scene reads, plus per-act progress and current chapter (dark/light).
 */
export default class ScrollManager {
  constructor({ state, reducedMotion, onProgress, onChapter }) {
    this.state = state;
    this.reducedMotion = reducedMotion;
    this.onProgress = onProgress;
    this.onChapter = onChapter;

    if (!reducedMotion) {
      this.lenis = new Lenis({ duration: 1.1, smoothWheel: true, lerp: 0.1 });
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => this.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    this._setupGlobal();
    this._setupChapters();
    this._setupActProgress();
  }

  _setupGlobal() {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        this.state.progress = self.progress;
        this.onProgress && this.onProgress(self.progress);
      },
    });
  }

  _setupChapters() {
    document.querySelectorAll('[data-bg]').forEach((el) => {
      const chapter = el.getAttribute('data-bg');
      ScrollTrigger.create({
        trigger: el, start: 'top 55%', end: 'bottom 45%',
        onToggle: (self) => { if (self.isActive) this._applyChapter(chapter); },
        onEnter: () => this._applyChapter(chapter),
        onEnterBack: () => this._applyChapter(chapter),
      });
    });
  }

  _applyChapter(chapter) {
    if (this._chapter === chapter) return;
    this._chapter = chapter;
    document.documentElement.setAttribute('data-chapter', chapter);
    this.onChapter && this.onChapter(chapter);
  }

  _setupActProgress() {
    this.state.acts = {};
    document.querySelectorAll('[data-act]').forEach((el) => {
      const name = el.getAttribute('data-act');
      this.state.acts[name] = 0;
      ScrollTrigger.create({
        trigger: el, start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => { this.state.acts[name] = self.progress; },
      });
    });
  }

  refresh() { ScrollTrigger.refresh(); }
}
