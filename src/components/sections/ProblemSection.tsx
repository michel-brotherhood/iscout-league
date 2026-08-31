import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import AnimatedCounter from '../AnimatedCounter';

import { useLanguage } from '@/contexts/LanguageContext';

const cardKeys = ['scouts', 'evaluations', 'videos', 'costs'] as const;

const ProblemSection = () => {
  const { t, locale, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={sectionRef} id="problema" className="py-16 sm:py-20 lg:py-24 bg-card relative overflow-hidden">
      <motion.div className="absolute inset-0 opacity-30" style={{ y: bgY }}>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,hsl(var(--destructive)/0.15),transparent_50%)]" />
      </motion.div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <motion.div className="absolute top-1/3 right-0 w-64 h-64 bg-destructive/5 rounded-full blur-3xl" style={{ y: orbY }} />

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-destructive/10 text-destructive text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('problem.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6 px-2">
              {t('problem.title')}{' '}
              <span className="text-destructive">{t('problem.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              {t('problem.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-6 mb-10 sm:mb-16">
          {cardKeys.map((key, index) => (
            <ScrollReveal key={key} animation="fadeInUp" delay={index * 0.1}>
              <motion.div className="glass-card tech-border p-3 sm:p-6 border-destructive/20 hover:border-destructive/40"
                whileHover={{ scale: 1.02, rotateY: 2 }} style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <motion.div className="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-destructive/20 flex items-center justify-center"
                    animate={{ x: [0, -3, 3, -2, 2, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 4, delay: index * 0.5 }}>
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2">{t(`problem.cards.${key}.title`)}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{t(`problem.cards.${key}.description`)}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div className="glass-card tech-border p-4 sm:p-6 lg:p-8 mb-10 sm:mb-16 border-destructive/20">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-destructive mb-4 sm:mb-6 flex items-center gap-2">
              {t('problem.consequencesTitle')}
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {locale.problem.consequences.map((consequence, index) => (
                <motion.li key={index} className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm lg:text-base"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                  <span className="text-destructive">→</span>
                  <span>{consequence}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn" delay={0.6}>
          <div className="text-center glass-card tech-border p-6 sm:p-8 lg:p-12 border-primary/20">
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-3 sm:mb-4">{t('problem.statsLabel')}</p>
            <p className="text-muted-foreground text-sm sm:text-base mb-2">{t('problem.statsDescription')}</p>
            <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold gradient-text mb-2">
              R$ <AnimatedCounter end={10} duration={2} /> {language === 'en' ? 'billion' : 'bilhões'}
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">{t('problem.statsSubtext')}</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">{t('problem.statsQuestion')}</p>
            <p className="text-muted-foreground text-sm sm:text-base mt-2">{t('problem.statsChallenge')}</p>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-destructive/30 rounded-full"
            style={{ left: `${20 + i * 30}%`, bottom: `${15 + (i % 2) * 30}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 5 + i * 0.5, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </div>
    </section>
  );
};

export default ProblemSection;
