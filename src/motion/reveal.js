import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Text/element reveals + kinetic pipeline typography + tracking HUD. */
export function initReveals({ reducedMotion }) {
  if (reducedMotion) {
    document.querySelectorAll('[data-reveal],[data-stagger]').forEach((el) => el.classList.add('is-in'));
    return;
  }

  // Split reveal lines into words wrapped for masked slide-up
  document.querySelectorAll('[data-reveal-line]').forEach((el) => {
    if (el.classList.contains('problem__giant')) return; // handled as whole
    const inner = document.createElement('span');
    inner.style.display = 'inline-block';
    inner.style.maxWidth = '100%';
    inner.style.transform = 'translateY(110%)';
    inner.textContent = el.textContent;
    el.textContent = '';
    el.style.display = el.tagName === 'SPAN' ? 'inline-block' : 'block';
    el.style.overflow = 'hidden';
    el.appendChild(inner);
    el._revealInner = inner;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el._revealInner) {
        gsap.to(el._revealInner, { y: '0%', duration: 1, ease: 'power3.out' });
      } else {
        el.classList.add('is-in');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal],[data-reveal-line],[data-stagger]').forEach((el) => io.observe(el));

  // problem giant word: scale/opacity as you scroll through
  const giant = document.querySelector('.problem__giant');
  if (giant) {
    gsap.fromTo(giant, { opacity: 0, letterSpacing: '0.2em', y: 40 },
      { opacity: 1, letterSpacing: '-0.04em', y: 0, ease: 'none',
        scrollTrigger: { trigger: '#problema', start: 'top top', end: '+=60%', scrub: true } });
  }

  // pipeline steps + kinetic words light up across the pipeline act
  const steps = [...document.querySelectorAll('.pipeline__steps li')];
  const kinetic = [...document.querySelectorAll('[data-kinetic]')];
  const pipe = document.querySelector('#descoberta');
  if (pipe) {
    ScrollTrigger.create({
      trigger: pipe, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const si = Math.min(steps.length - 1, Math.floor(p * steps.length));
        steps.forEach((s, i) => s.classList.toggle('is-active', i <= si));
        const ki = Math.min(kinetic.length - 1, Math.floor(p * kinetic.length));
        kinetic.forEach((k, i) => k.classList.toggle('is-active', i === ki));
      },
    });
  }

  // tracking HUD scenographic values
  const hud = document.querySelector('[data-hud]');
  if (hud) {
    const status = hud.querySelector('[data-hud-status]');
    const pos = hud.querySelector('[data-hud-pos]');
    const conf = hud.querySelector('[data-hud-conf]');
    ScrollTrigger.create({
      trigger: pipe, start: 'top 60%', end: 'bottom bottom',
      onUpdate: (self) => {
        const on = self.progress > 0.18;
        hud.classList.toggle('is-in', on);
        if (on) {
          status.textContent = 'ACTIVE';
          pos.textContent = `x${(0.3 + Math.sin(self.progress * 12) * 0.3).toFixed(2)} / y${(0.5 + Math.cos(self.progress * 9) * 0.3).toFixed(2)}`;
          conf.textContent = (0.82 + Math.sin(self.progress * 20) * 0.12).toFixed(2);
        }
      },
    });
  }

  // matching countdown
  const matchCount = document.querySelector('[data-match-count]');
  const matching = document.querySelector('#matching');
  if (matchCount && matching) {
    const steps2 = [300, 84, 23, 7, 3];
    ScrollTrigger.create({
      trigger: matching, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        const i = Math.min(steps2.length - 1, Math.floor(self.progress * steps2.length));
        matchCount.textContent = steps2[i];
      },
    });
  }
}
