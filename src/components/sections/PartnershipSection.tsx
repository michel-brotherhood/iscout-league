import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';

const PartnershipSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const benefits = locale.partnership.benefits;

  return (
    <section id="parceria" className="py-16 sm:py-20 lg:py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('partnership.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('partnership.title')} <span className="gradient-text">{t('partnership.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {t('partnership.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
              <motion.div className="glass-card p-4 sm:p-5 lg:p-6 h-full" whileHover={{ y: -4 }}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="scaleIn" delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button onClick={openContact} className="btn-primary cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('partnership.ctaPrimary')}
            </motion.button>
            <motion.button onClick={openContact} className="btn-secondary cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('partnership.ctaSecondary')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PartnershipSection;
