import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';

const FinalCTASection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const guarantees = locale.finalCta.guarantees;

  return (
    <section id="cta-final" className="py-14 sm:py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute top-1/4 left-[10%] w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/15 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-1/4 right-[10%] w-64 sm:w-[400px] h-64 sm:h-[400px] bg-secondary/15 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-[300px] h-48 sm:h-[300px] bg-accent/10 rounded-full blur-[80px]"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{ left: `${20 + i * 30}%`, top: `${25 + (i % 2) * 25}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 1, ease: 'easeInOut' }} />
        ))}
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal animation="scaleIn">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/40 via-secondary/20 to-primary/40 blur-sm" />
            <div className="relative glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 xl:p-16 text-center border-primary/20 overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-secondary/10 to-transparent rounded-tl-full" />

              <motion.div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 border border-primary/20 mb-6 sm:mb-8"
                animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                <span className="text-2xl sm:text-3xl">⚽</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-helvetica-neue mb-4 sm:mb-6 leading-[1.1] tracking-tight uppercase">
                {t('finalCta.title')}{' '}
                <span className="gradient-text relative inline-block">
                  {t('finalCta.titleHighlight')}
                  <motion.span className="absolute -top-1 -right-5 sm:-top-2 sm:-right-7"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </motion.span>
                </span>
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-3 sm:mb-4 max-w-xl mx-auto leading-relaxed">
                {t('finalCta.description')}
              </p>
              <p className="text-foreground font-semibold mb-8 sm:mb-10 max-w-xl mx-auto text-xs sm:text-sm lg:text-base">
                {t('finalCta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-5 sm:mb-6">
                <motion.button onClick={openContact}
                  className="group relative btn-primary text-xs sm:text-sm lg:text-base px-6 sm:px-8 py-3 sm:py-4 cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t('finalCta.ctaPrimary')}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary"
                    animate={{ x: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ opacity: 0.3 }} />
                </motion.button>
                <motion.button onClick={openContact}
                  className="btn-secondary text-xs sm:text-sm lg:text-base px-6 sm:px-8 py-3 sm:py-4 cursor-pointer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {t('finalCta.ctaSecondary')}
                </motion.button>
              </div>

              <p className="text-[10px] sm:text-xs text-muted-foreground/70 mb-6 sm:mb-8 tracking-wide">{t('finalCta.trust')}</p>

              <div className="border-t border-border/30 pt-6 sm:pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 sm:gap-y-3.5 max-w-2xl mx-auto text-left">
                  {guarantees.map((guarantee, index) => (
                    <motion.div key={index} className="flex items-center gap-2.5"
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }}>
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground leading-tight">{guarantee}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCTASection;
