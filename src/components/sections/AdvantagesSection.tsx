import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Trophy, TrendingDown, Brain, BarChart3, Search, Zap, Globe, Palette } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';

const icons = [Trophy, TrendingDown, Brain, BarChart3, Search, Zap, Globe, Palette];

const AdvantagesSection = () => {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const advantages = locale.advantages.items;

  return (
    <section ref={sectionRef} id="vantagens" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-grid-pattern">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: orbY1 }} className="absolute top-0 right-0 w-64 sm:w-[400px] lg:w-[500px] h-64 sm:h-[400px] lg:h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <motion.div style={{ y: orbY2 }} className="absolute bottom-0 left-0 w-48 sm:w-[300px] lg:w-[400px] h-48 sm:h-[300px] lg:h-[400px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('advantages.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('advantages.title')} <span className="gradient-text-iscout">{t('advantages.titleHighlight')}</span> {t('advantages.titleEnd')}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {advantages.map((advantage, index) => {
            const Icon = icons[index];
            return (
              <ScrollReveal key={index} animation="scaleIn" delay={index * 0.08}>
                <motion.div className="glass-card tech-border p-2.5 sm:p-4 lg:p-6 h-full text-center"
                  whileHover={{ y: -8, scale: 1.02, rotateY: 3 }} transition={{ duration: 0.3 }} style={{ transformStyle: 'preserve-3d' }}>
                  <motion.div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto mb-2 sm:mb-3 lg:mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                    whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-primary" />
                  </motion.div>
                  <h3 className="font-bold text-foreground text-xs sm:text-sm mb-1 sm:mb-2 lg:mb-3">{advantage.title}</h3>
                  <p className="text-muted-foreground text-[10px] sm:text-xs lg:text-sm leading-relaxed">{advantage.description}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{ left: `${15 + i * 30}%`, top: `${25 + (i % 2) * 25}%` }}
            animate={{ y: [-15, 15, -15], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </div>
    </section>
  );
};

export default AdvantagesSection;
