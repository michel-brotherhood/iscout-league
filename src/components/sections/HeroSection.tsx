import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Brain, Target, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';
import manifestoVideo from '@/assets/manifesto-video.mp4';

const featureKeys = ['ai', 'precision', 'realTime', 'network'] as const;
const featureIcons = [Brain, Target, TrendingUp, Users];
const featureAnimations = [
  { animate: { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const } },
  { animate: { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }, transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const } },
  { animate: { y: [0, -5, 0] }, transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } },
  { animate: { rotate: [0, 360] }, transition: { duration: 8, repeat: Infinity, ease: "linear" as const } },
];

const HeroSection = () => {
  const { t } = useLanguage();
  const { openContact } = useContactDialog();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={sectionRef} className="relative z-10 min-h-screen flex flex-col overflow-hidden">
      {/* Hero gradient background */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Video Background with parallax */}
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <video autoPlay muted loop playsInline preload="auto" className="w-full h-full object-cover opacity-20" style={{ objectPosition: 'center 30%' }}>
          <source src={manifestoVideo} type="video/mp4" />
        </video>
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

      {/* Floating orbs with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div style={{ y: orbY1 }} className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-parallax-float" />
        <motion.div style={{ y: orbY2 }} className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-iscout-lime/10 rounded-full blur-[80px] animate-parallax-float" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[60px]" />
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-primary/60 rounded-full"
            style={{ left: `${10 + i * 20}%`, top: `${15 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div className="section-container relative z-10 flex-1 flex flex-col justify-center pt-24 sm:pt-28 lg:pt-32 pb-8 px-6 sm:px-8" style={{ y: contentY }}>
        <div className="max-w-3xl text-center sm:text-left mb-10 lg:mb-14">
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-helvetica-neue leading-[1.1] mb-7 sm:mb-5"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            {t('hero.title')}
            <br className="hidden lg:block" />
            <span className="lg:hidden"> </span>
            <span className="gradient-text-iscout">{t('hero.highlight')}</span>{t('hero.subtitle')}
          </motion.h1>

          <motion.p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-lg leading-relaxed"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            {t('hero.description')}{' '}
            <span className="text-iscout-lime font-medium">{t('hero.descriptionHighlight')}</span>
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start items-center mb-6"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <motion.button onClick={openContact} className="btn-primary animate-pulse-glow cursor-pointer w-full max-w-[280px] sm:w-auto sm:max-w-none"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {t('hero.ctaPrimary')}
            </motion.button>
            <motion.a href="#como-funciona" className="btn-secondary flex items-center justify-center gap-2 w-full max-w-[280px] sm:w-auto sm:max-w-none"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Play size={18} />
              {t('hero.ctaSecondary')}
            </motion.a>
          </motion.div>

          <motion.p className="text-xs text-muted-foreground/70 text-center sm:text-left"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}>
            {t('hero.trust')}
          </motion.p>
        </div>

        <motion.div className="hero-divider w-full max-w-4xl mx-auto sm:mx-0 mb-10"
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8 }} />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 max-w-6xl w-full">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index];
            const anim = featureAnimations[index];
            return (
              <motion.div key={key} className="feature-card group cursor-pointer"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }} whileHover={{ y: -4 }}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <motion.div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ boxShadow: ['0 0 0px hsla(197, 100%, 64%, 0)', '0 0 12px hsla(197, 100%, 64%, 0.3)', '0 0 0px hsla(197, 100%, 64%, 0)'] }}
                    transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}>
                    <motion.div animate={anim.animate} transition={anim.transition}>
                      <Icon className="w-5 h-5 text-primary icon-glow" />
                    </motion.div>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">{t(`hero.features.${key}.title`)}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t(`hero.features.${key}.description`)}</p>
                    <p className="feature-highlight">{t(`hero.features.${key}.highlight`)}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
