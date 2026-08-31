import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';
import { Globe2, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';
import logo from '@/assets/iscout-logo-branca.png';

// Scroll range over which the header morphs from "full bar" to "floating island".
const SHRINK_START = 0;
const SHRINK_END = 140;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { openContact, isOpen: isContactOpen } = useContactDialog();

  // Smoothly interpolate every header dimension based on scrollY.
  const { scrollY } = useScroll();
  const navHeight = useTransform(scrollY, [SHRINK_START, SHRINK_END], [80, 52]);
  const logoHeight = useTransform(scrollY, [SHRINK_START, SHRINK_END], [40, 26]);
  const topOffset = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 12]);
  const sideInset = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 24]);
  const radius = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 999]);
  const bgAlpha = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 0.7]);
  const borderAlpha = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 0.4]);
  const blurPx = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 18]);
  const shadowAlpha = useTransform(scrollY, [SHRINK_START, SHRINK_END], [0, 0.25]);
  const maxWidth = useTransform(scrollY, [SHRINK_START, SHRINK_END], [1400, 1100]);

  const background = useMotionTemplate`hsl(var(--background) / ${bgAlpha})`;
  const borderColor = useMotionTemplate`hsl(var(--border) / ${borderAlpha})`;
  const backdropFilter = useMotionTemplate`blur(${blurPx}px)`;
  const boxShadow = useMotionTemplate`0 8px 32px hsl(0 0% 0% / ${shadowAlpha})`;

  // CTA reveal: still threshold-based (only after user passes 1st section).
  useMotionValueEvent(scrollY, 'change', (y) => {
    setShowCta(y > window.innerHeight * 0.85);
  });

  const navLinks: { href?: string; to?: string; label: string; action?: 'contact' }[] = [
    { href: '/#problema', label: t('nav.problem') },
    { href: '/#solucao', label: t('nav.solution') },
    { href: '/#como-funciona', label: t('nav.howItWorks') },
    { action: 'contact', label: t('nav.contact') },
    { to: '/privacy', label: t('nav.privacy') },
    { href: '/#faq', label: t('nav.faq') },
    { href: '/#parceiros', label: t('nav.partners') },
  ];

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const menuItemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.08 * i, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    }),
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <>
      <motion.header
        style={{ top: topOffset, paddingLeft: sideInset, paddingRight: sideInset }}
        className={`fixed left-0 right-0 ${isContactOpen ? 'z-30 pointer-events-none opacity-40' : 'z-[100]'}`}
      >
        <motion.div
          style={{
            maxWidth,
            background,
            borderColor,
            backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            borderRadius: radius,
            boxShadow,
          }}
          className="mx-auto border border-transparent px-4 sm:px-6 lg:px-8"
        >
          <motion.nav style={{ height: navHeight }} className="flex items-center justify-between">
            {/* Logo - sempre volta para a home. Renderizada em alta resolução e escalada via height para preservar nitidez. */}
            <Link to="/" className="flex-shrink-0 relative z-[110]" aria-label="iSCOUT - Página inicial">
              <motion.img
                src={logo}
                alt="iSCOUT"
                style={{ height: logoHeight }}
                className="w-auto"
                draggable={false}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                if (link.action === 'contact') {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={openContact}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  );
                }
                if (link.to) {
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                );
              })}
              <AnimatePresence>
                {showCta && (
                  <motion.button
                    type="button"
                    onClick={openContact}
                    initial={{ opacity: 0, scale: 0.85, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.85, x: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      backgroundImage:
                        'linear-gradient(325deg, hsl(222 100% 61%) 0%, hsl(197 100% 64%) 55%, hsl(222 100% 61%) 90%)',
                      backgroundSize: '280% auto',
                      boxShadow:
                        '0 0 14px hsla(197,100%,64%,0.45), inset 2px 2px 4px hsla(197,100%,85%,0.4), inset -2px -2px 4px hsla(222,100%,45%,0.3)',
                    }}
                    className="inline-flex items-center justify-center rounded-md font-semibold text-white cursor-pointer transition-all duration-300 hover:[background-position:right_center] text-xs h-8 px-3.5"
                  >
                    {t('nav.scheduleDemo')}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Language Switcher */}
            <div className="hidden lg:block">
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-transparent border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {language === 'pt' ? 'PT' : 'EN'}
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden relative z-[110]">
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-transparent border border-border/40 hover:border-primary/50 transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <Globe2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {language === 'pt' ? 'PT' : 'EN'}
                </span>
              </motion.button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-10 h-10 flex items-center justify-center text-foreground"
                aria-label="Menu"
              >
                <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`} />
                <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'}`} />
                <span className={`absolute w-5 h-0.5 bg-current rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`} />
              </button>
            </div>
          </motion.nav>
        </motion.div>
      </motion.header>

      {/* Mobile Fullscreen Menu - Outside header to avoid stacking context issues */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2.5rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2.5rem) 2.5rem)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-[105] lg:hidden bg-background"
          >
            {/* Top bar: logo + close */}
            <div className="absolute top-0 left-0 right-0 px-8 sm:px-12 py-5 z-20 flex items-center justify-between">
              <img src={logo} alt="iSCOUT" className="h-7 w-auto" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all"
                aria-label="Fechar menu"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, hsla(76, 73%, 55%, 0.08) 0%, transparent 70%)' }}
              />
              <div
                className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
                style={{ background: 'radial-gradient(circle, hsla(197, 100%, 64%, 0.06) 0%, transparent 70%)' }}
              />
            </div>

            {/* Menu Content */}
            <div className="relative z-10 flex flex-col h-full px-8 sm:px-12 pt-20 pb-8 overflow-y-auto overscroll-contain">
              <nav className="space-y-1 flex-1">
                {navLinks.map((link, i) => {
                  const labelEl = (
                    <>
                      <span className="text-xl sm:text-2xl font-bold font-helvetica-neue text-foreground/90 group-hover:text-primary transition-colors duration-300">
                        {link.label}
                      </span>
                      <ChevronRight
                        size={20}
                        className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                      />
                    </>
                  );
                  const cls =
                    'group flex items-center justify-between py-3 border-b border-border/20 hover:border-primary/40 transition-colors duration-300 w-full text-left';

                  if (link.action === 'contact') {
                    return (
                      <motion.button
                        key={link.label}
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          openContact();
                        }}
                        custom={i}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cls}
                      >
                        {labelEl}
                      </motion.button>
                    );
                  }

                  if (link.to) {
                    const MotionLink = motion(Link);
                    return (
                      <MotionLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        custom={i}
                        variants={menuItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={cls}
                      >
                        {labelEl}
                      </MotionLink>
                    );
                  }

                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      custom={i}
                      variants={menuItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className={cls}
                    >
                      {labelEl}
                    </motion.a>
                  );
                })}
              </nav>

              {/* CTA bottom */}
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openContact();
                  }}
                  className="btn-primary inline-flex text-sm w-full justify-center"
                >
                  {t('hero.ctaPrimary')}
                </button>
              </motion.div>

              {/* Gradient line */}
              <motion.div
                className="mt-3 mx-auto w-24 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, hsl(76 73% 55%), hsl(197 100% 64%), hsl(222 100% 61%))' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
