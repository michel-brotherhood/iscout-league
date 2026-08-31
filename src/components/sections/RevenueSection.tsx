import { motion } from 'framer-motion';
import { Building, Video, GraduationCap, Sprout, Coins, Settings, Megaphone, Handshake } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';

const revenueIcons = [Building, Video, GraduationCap, Sprout, Coins, Settings, Megaphone, Handshake];

const RevenueSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const models = locale.revenue.models;

  return (
    <section id="receitas" className="py-16 sm:py-20 lg:py-24 bg-card relative overflow-hidden">
      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('revenue.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('revenue.title')}{' '}
              <span className="gradient-text">{t('revenue.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              {t('revenue.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {models.map((model, index) => {
            const Icon = revenueIcons[index];
            return (
              <ScrollReveal key={index} animation="fadeInUp" delay={index * 0.1}>
                <motion.div className="glass-card p-4 sm:p-5 lg:p-6 h-full" whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-xs sm:text-sm mb-2 sm:mb-3">{model.title}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{model.description}</p>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal animation="scaleIn" delay={0.8}>
          <div className="text-center">
            <motion.button onClick={openContact} className="btn-primary inline-flex text-sm sm:text-base cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('revenue.cta')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default RevenueSection;
