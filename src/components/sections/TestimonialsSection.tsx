import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import AnimatedCounter from '../AnimatedCounter';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContactDialog } from '@/contexts/ContactDialogContext';
import icone from '@/assets/icone.png';

const statsValues = [
  { value: 2547, prefix: '+', suffix: '' },
  { value: 127, prefix: '', suffix: '' },
  { value: 4.3, prefix: 'R$ ', suffix: ' mi', decimals: 1 },
  { value: 98, prefix: '', suffix: '%' },
];

const cardGlowColors = [
  'from-iscout-lime/30 to-iscout-cyan/30',
  'from-iscout-cyan/30 to-iscout-blue/30',
  'from-iscout-blue/30 to-iscout-lime/30',
  'from-iscout-lime/30 to-iscout-blue/30',
  'from-iscout-cyan/30 to-iscout-lime/30',
  'from-iscout-blue/30 to-iscout-cyan/30',
  'from-iscout-lime/30 to-iscout-cyan/30',
  'from-iscout-cyan/30 to-iscout-blue/30',
];

const TestimonialsSection = () => {
  const { t, locale } = useLanguage();
  const { openContact } = useContactDialog();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const testimonials = locale.testimonials.items;
  const statsLabels = locale.testimonials.stats;

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  return (
    <section id="depoimentos" className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-[5%] w-64 sm:w-96 h-64 sm:h-96 bg-iscout-lime/5 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[5%] w-72 sm:w-80 h-72 sm:h-80 bg-iscout-cyan/5 rounded-full blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="section-container relative z-10">
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-iscout-lime/10 text-iscout-lime text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('testimonials.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('testimonials.title')}{' '}
              <span className="gradient-text-iscout">{t('testimonials.titleHighlight')}</span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fadeInUp" delay={0.2}>
          <div className="mb-12 sm:mb-20 relative">
            <Carousel setApi={setApi} opts={{ align: 'start', loop: true }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]} className="w-full px-4 sm:px-12">
              <CarouselContent className="-ml-2 md:-ml-4">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <motion.div
                      className="relative group h-full"
                      whileHover={{ y: -8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {/* Gradient border glow */}
                      <div className={cn(
                        "absolute -inset-[1px] rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500",
                        cardGlowColors[index % cardGlowColors.length]
                      )} />
                      <div className={cn(
                        "absolute -inset-[1px] rounded-2xl bg-gradient-to-br opacity-30 transition-opacity duration-500",
                        cardGlowColors[index % cardGlowColors.length]
                      )} />

                      <div className="relative glass-card rounded-2xl p-5 sm:p-6 lg:p-7 h-full flex flex-col border-border/40">
                        {/* Quote icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * i + 0.2, type: 'spring', stiffness: 400 }}
                                viewport={{ once: true }}
                              >
                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-iscout-lime text-iscout-lime" />
                              </motion.div>
                            ))}
                          </div>
                          <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-iscout-lime/20 group-hover:text-iscout-lime/40 transition-colors duration-300" />
                        </div>

                        {/* Testimonial text */}
                        <p className="text-foreground/90 flex-1 mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base italic">
                          "{testimonial.text}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex-shrink-0">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-iscout-lime to-iscout-cyan p-[1.5px]">
                              <div className="w-full h-full rounded-full bg-card flex items-center justify-center p-1.5">
                                <img src={icone} alt="iSCOUT" className="w-full h-full object-contain" />
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-sm truncate">{testimonial.author}</p>
                            <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation arrows */}
              <motion.button
                onClick={() => api?.scrollPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-card border border-border/50 hover:border-iscout-lime/50 hover:bg-iscout-lime/10 text-muted-foreground hover:text-iscout-lime items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => api?.scrollNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-card border border-border/50 hover:border-iscout-lime/50 hover:bg-iscout-lime/10 text-muted-foreground hover:text-iscout-lime items-center justify-center transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Carousel>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: count }).map((_, index) => (
                <button key={index} onClick={() => scrollTo(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    current === index
                      ? "bg-iscout-lime w-8 shadow-[0_0_8px_hsla(76,73%,55%,0.4)]"
                      : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-iscout-lime/20 via-iscout-cyan/10 to-iscout-lime/20 blur-sm" />
            <div className="relative glass-card rounded-2xl p-4 sm:p-8 lg:p-10">
              <h3 className="text-center text-xs sm:text-sm lg:text-base text-muted-foreground mb-6 sm:mb-8 uppercase tracking-widest font-medium">
                {t('testimonials.statsTitle')}
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {statsValues.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold gradient-text-iscout mb-1 sm:mb-2">
                      <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals || 0} duration={2.5} />
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{statsLabels[index]?.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn" delay={0.5}>
          <div className="text-center mt-8 sm:mt-12">
            <motion.button onClick={openContact} className="btn-primary inline-flex text-sm sm:text-base cursor-pointer"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {t('testimonials.cta')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
