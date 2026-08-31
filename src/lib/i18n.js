/**
 * Compact PT/EN toggle. PT is the source of truth (already in the DOM);
 * EN swaps a curated set of the most visible strings by selector.
 * Full-site translation lives in the roadmap; this keeps the toggle honest.
 */
const EN = {
  '.site-header__nav a:nth-child(1)': 'The Challenge',
  '.site-header__nav a:nth-child(2)': 'Infrastructure',
  '.site-header__nav a:nth-child(3)': 'How it works',
  '.site-header__nav a:nth-child(4)': 'FAQ',
  '.site-header__nav a:nth-child(5)': 'Partners',
  '.act--hero .eyebrow': 'Scouting infrastructure · grassroots football',
  '.hero__title .line:nth-child(1)': 'No talent',
  '.hero__title .line--accent': 'playing in the dark.',
  '.hero__desc': 'Scouting infrastructure that accelerates talent discovery and democratizes technical evaluation with quality and precision.',
  '.act--cta .cta__title .line:nth-child(1)': 'Talent is',
  '.act--cta .cta__title .line:nth-child(2)': 'everywhere.',
  '.act--cta .cta__title .line--accent': 'Opportunity is not.',
};

export function initI18n() {
  const btn = document.querySelector('[data-lang-toggle]');
  if (!btn) return;
  let en = false;
  const originals = new Map();

  const apply = () => {
    for (const [sel, val] of Object.entries(EN)) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const target = el._revealInner || el; // respect reveal wrapping
      if (en) {
        if (!originals.has(target)) originals.set(target, target.textContent);
        target.textContent = val;
      } else if (originals.has(target)) {
        target.textContent = originals.get(target);
      }
    }
    document.documentElement.lang = en ? 'en' : 'pt-BR';
    btn.classList.toggle('is-en', en);
    btn.setAttribute('aria-label', en ? 'Switch to Portuguese' : 'Mudar para inglês');
  };

  btn.addEventListener('click', () => { en = !en; apply(); });
}
