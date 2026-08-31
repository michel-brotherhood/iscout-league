import { gsap } from 'gsap';

/** Minimal reveals: masked slide-up for [data-rvl] headline spans, fade-up for [data-reveal]. */
export function initReveals({ reducedMotion } = {}) {
  if (reducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
    return;
  }

  // wrap headline spans so their inner text slides up under an overflow-hidden mask
  document.querySelectorAll('[data-rvl]').forEach((el) => {
    const inner = document.createElement('span');
    inner.textContent = el.textContent;
    inner.style.display = 'block';
    inner.style.transform = 'translateY(110%)';
    inner.style.willChange = 'transform';
    el.textContent = '';
    el.style.display = 'block';
    el.style.overflow = 'hidden';
    el.appendChild(inner);
    el._inner = inner;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el._inner) {
        const sibs = [...el.parentElement.querySelectorAll('[data-rvl]')];
        const idx = Math.max(0, sibs.indexOf(el));
        gsap.to(el._inner, { y: '0%', duration: 1, ease: 'power3.out', delay: idx * 0.08 });
      } else {
        el.classList.add('in');
      }
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal],[data-rvl]').forEach((el) => io.observe(el));
}
