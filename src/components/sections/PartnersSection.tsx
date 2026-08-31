import { motion } from 'framer-motion';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';

const PartnersSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const models = (locale as any).partners.models;

  return (
    <section id="parceiros" className="py-16 sm:py-20 lg:py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-transparent to-card/50" />
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('partners.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('partners.title')} <span className="gradient-text">{t('partners.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {t('partners.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {models.map((model: { icon: string; title: string; description: string }, index: number) => (
            <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
              <motion.div
                className="glass-card p-5 sm:p-6 h-full flex flex-col"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-3xl mb-3">{model.icon}</span>
                <h3 className="font-bold text-foreground text-sm sm:text-base mb-2">{model.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm flex-1">{model.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="scaleIn" delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button onClick={openContact} className="btn-primary cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('partners.cta')}
            </motion.button>
            <motion.button onClick={openContact} className="btn-secondary cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('partners.ctaSecondary')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PartnersSection;
