import { motion } from 'framer-motion';
import { Mail, Handshake, LifeBuoy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';

const contactChannels = [
  { icon: Mail, label: 'Dúvidas gerais', email: 'contato@iscout.tech' },
  { icon: Handshake, label: 'Parcerias', email: 'parcerias@iscout.tech' },
  { icon: LifeBuoy, label: 'Suporte', email: 'suporte@iscout.tech' },
];

const FAQSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const categories = locale.faq.categories;

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('faq.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('faq.title')} <span className="gradient-text">{t('faq.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              {t('faq.description')}
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {categories.map((category, catIndex) => (
            <ScrollReveal key={catIndex} animation="fadeInUp" delay={catIndex * 0.1}>
              <div className="glass-card p-4 sm:p-6 lg:p-8">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-4 sm:mb-6">{category.title}</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem key={qIndex} value={`${catIndex}-${qIndex}`}
                      className="border-border/50 px-4 rounded-lg bg-background/30">
                      <AccordionTrigger className="text-left text-foreground hover:text-primary hover:no-underline py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div className="max-w-4xl mx-auto mt-10 sm:mt-14">
            <div className="glass-card p-5 sm:p-6 lg:p-8">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-1">
                📞 Canais de contato
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Fale diretamente com a equipe certa para o seu pedido.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contactChannels.map(({ icon: Icon, label, email }) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="group flex items-start gap-3 p-3 sm:p-4 rounded-lg border border-border/40 bg-background/40 hover:border-primary/50 hover:bg-primary/5 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {email}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn" delay={0.5}>
          <div className="text-center mt-12">
            <motion.button onClick={openContact} className="btn-secondary inline-flex cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('faq.cta')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
