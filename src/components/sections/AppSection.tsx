import { useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Smartphone, TrendingUp, Globe, Bell } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import ParallaxLayer from '../ParallaxLayer';
import { Badge } from '../ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';
import tabletField from '@/assets/tablet-field.png';

const featureIcons = [TrendingUp, Globe, Smartphone, Bell];

const AppSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateY(x * 12);
    setRotateX(-y * 8);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  const features = locale.app.features;

  return (
    <section ref={sectionRef} id="app" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden bg-grid-pattern">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div style={{ y: orbY1 }} className="absolute top-1/4 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full blur-3xl" />
        <motion.div style={{ y: orbY2 }} className="absolute bottom-1/4 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text + Features */}
          <div className="order-2 lg:order-1">
            <ScrollReveal animation="fadeInUp">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {t('app.badge')}
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
                {t('app.title')}<br />
                <span className="gradient-text-iscout">{t('app.titleHighlight')}</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                {t('app.description')}
              </p>
            </ScrollReveal>

            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
                    <motion.div className="flex items-start gap-3 sm:gap-4 glass-card p-3 sm:p-4 tech-border"
                      whileHover={{ x: 8, scale: 1.02 }} transition={{ duration: 0.2 }}>
                      <motion.div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                        whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal animation="fadeInUp" delay={0.5}>
              <div className="mt-6 sm:mt-8">
                <motion.button onClick={openContact} className="btn-secondary inline-flex text-sm sm:text-base cursor-pointer"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {t('app.cta')}
                </motion.button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2">
            <ScrollReveal animation="scaleIn">
              <ParallaxLayer speed="slow" direction="up">
                <motion.div
                  ref={imageRef}
                  className="relative w-full max-w-md lg:max-w-lg mx-auto"
                  style={{ perspective: 1200, y: imageY }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Ambient glow */}
                  <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 rounded-[2rem] blur-3xl opacity-60" />

                  <motion.div
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateX, rotateY }}
                    transition={{ type: 'spring', stiffness: 120, damping: 25 }}
                    className="relative"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-border/20">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/20 z-10 pointer-events-none" />

                      <motion.img
                        src={tabletField}
                        alt="iSCOUT - Tecnologia no campo"
                        className="w-full h-auto object-cover"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      />

                      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
                    </div>

                    <div className="absolute -left-3 top-1/4 bottom-1/4 w-1.5 bg-primary/20 blur-xl rounded-full" />
                    <div className="absolute -right-3 top-1/4 bottom-1/4 w-1.5 bg-secondary/20 blur-xl rounded-full" />
                  </motion.div>
                </motion.div>
              </ParallaxLayer>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{ left: `${20 + i * 30}%`, top: `${20 + (i % 2) * 30}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </div>
    </section>
  );
};

export default AppSection;
