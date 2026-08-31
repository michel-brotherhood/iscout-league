import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';

const ForWhoSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const [activeAudience, setActiveAudience] = useState<number | null>(null);
  const audiences = locale.forWho.audiences;

  return (
    <section id="para-quem" className="py-16 sm:py-20 lg:py-24 bg-card relative overflow-hidden">
      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('forWho.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('forWho.title')}{' '}
              <span className="gradient-text">{t('forWho.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              {t('forWho.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-2 sm:space-y-4 max-w-4xl mx-auto">
          {audiences.map((audience, index) => (
            <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
              <motion.div className={`glass-card overflow-hidden transition-all duration-300 ${activeAudience === index ? 'border-primary/50' : ''}`}>
                <button onClick={() => setActiveAudience(activeAudience === index ? null : index)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg sm:text-xl lg:text-2xl">
                      {audience.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm sm:text-base">{audience.title}</h3>
                      <p className="text-xs sm:text-sm text-primary">{audience.subtitle}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${activeAudience === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAudience === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-border/50 pt-3 sm:pt-4">
                        <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                          {audience.features.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-foreground font-medium italic border-l-4 border-primary pl-3 sm:pl-4 text-sm sm:text-base">
                          {audience.cta}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="scaleIn" delay={0.5}>
          <div className="text-center mt-8 sm:mt-12">
            <motion.button onClick={openContact} className="btn-secondary inline-flex text-sm sm:text-base cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('forWho.cta')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ForWhoSection;
