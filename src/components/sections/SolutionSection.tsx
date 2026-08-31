import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Target, Coins, BarChart3, Rocket } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import ParallaxLayer from '../ParallaxLayer';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';
import scoutingPoseAnalysis from '@/assets/scouting-pose-analysis.gif';

const solutionIcons = [Target, Coins, BarChart3, Rocket];
const isAIFlags = [true, false, false, false];

const SolutionSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    const el = imgWrapperRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setImgSrc(scoutingPoseAnalysis);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(scoutingPoseAnalysis);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '600px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cards = locale.solution.cards;

  return (
    <section ref={sectionRef} id="solucao" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-grid-pattern">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: orbY1 }} className="absolute top-1/4 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-iscout-lime/5 rounded-full blur-3xl" />
        <motion.div style={{ y: orbY2 }} className="absolute bottom-1/4 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/5 rounded-full blur-3xl" />
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-iscout-lime/40 rounded-full"
            style={{ left: `${20 + i * 30}%`, top: `${30 + i * 15}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </div>


      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-iscout-lime/10 text-iscout-lime text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('solution.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('solution.title')} <span className="gradient-text-iscout">{t('solution.titleHighlight')}</span> {t('solution.titleEnd')}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              {t('solution.description')}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn" delay={0.2}>
          <div className="flex justify-center mb-16 sm:mb-20">
            <ParallaxLayer speed="slow" direction="up">
              <motion.div className="relative w-full max-w-xs sm:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-iscout-lime/30 via-iscout-cyan/20 to-iscout-blue/30 blur-3xl scale-110 animate-pulse-glow" />
                <div className="absolute -top-2 -left-2 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-iscout-lime/60" />
                <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-iscout-cyan/60" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-iscout-cyan/60" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-iscout-lime/60" />
                <div ref={imgWrapperRef} className="relative ai-showcase rounded-2xl overflow-hidden">
                  <div className="bg-background rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt="Análise técnica de jogadores de futebol com detecção de pose e índice comparativo"
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-center sm:object-center"
                        style={{ objectPosition: 'center 35%' }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-iscout-lime/10 via-iscout-cyan/10 to-iscout-blue/10 animate-pulse" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
                </div>
                <div className="h-8 sm:h-12 lg:h-16 bg-gradient-to-b from-iscout-cyan/10 to-transparent rounded-b-2xl blur-sm transform scale-y-[-1] opacity-30 mt-1" />
                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 translate-y-full px-2 max-w-[90vw]">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-iscout-lime/10 border border-iscout-lime/30 text-iscout-lime text-[11px] leading-tight sm:text-sm font-medium text-center">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-iscout-lime rounded-full animate-pulse flex-shrink-0" />
                    <span className="break-words">{t('solution.realTimeLabel')}</span>
                  </span>
                </div>
              </motion.div>
            </ParallaxLayer>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-3 sm:gap-6 lg:gap-8 mb-10 sm:mb-16 mt-16 sm:mt-20">
          {cards.map((card, index) => (
            <ScrollReveal key={index} animation={index % 2 === 0 ? 'slideInLeft' : 'slideInRight'} delay={index * 0.1}>
              <motion.div
                className={`glass-card tech-border p-3 sm:p-6 lg:p-8 h-full ${isAIFlags[index] ? 'border-iscout-lime/40 animate-glow-card-lime' : 'animate-glow-card'}`}
                whileHover={{ y: -8, rotateY: 2 }} transition={{ duration: 0.3 }} style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                  <motion.div className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-lg sm:text-2xl ${isAIFlags[index] ? 'bg-gradient-to-br from-iscout-lime/30 to-iscout-cyan/30' : 'bg-gradient-to-br from-primary/20 to-secondary/20'}`}
                    animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}>
                    {card.emoji}
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg text-foreground leading-tight break-words">{card.title}</h3>
                    <p className={`text-xs sm:text-sm leading-snug break-words ${isAIFlags[index] ? 'text-iscout-lime' : 'text-primary'}`}>{card.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-1.5 sm:space-y-3">
                  {card.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      <span className={`mt-0.5 flex-shrink-0 ${isAIFlags[index] ? 'text-iscout-lime' : 'text-primary'}`}>→</span>
                      <span className="break-words min-w-0">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div className="glass-card tech-border p-4 sm:p-6 lg:p-8 text-center max-w-3xl mx-auto mb-8 sm:mb-12 border-iscout-lime/30">
            <blockquote className="text-base sm:text-lg lg:text-xl xl:text-2xl italic text-foreground mb-3 sm:mb-4">
              {t('solution.quote')}
            </blockquote>
            <cite className="text-muted-foreground text-sm sm:text-base">{t('solution.quoteAuthor')}</cite>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn" delay={0.5}>
          <div className="text-center">
            <motion.button onClick={openContact} className="btn-primary inline-flex text-sm sm:text-base cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('solution.cta')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default SolutionSection;
