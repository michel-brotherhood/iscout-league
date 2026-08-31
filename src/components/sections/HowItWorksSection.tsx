import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Smartphone, Video, Upload, Shrink, Cloud, Brain, FileText } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';

const stepIcons = [Smartphone, Video, Upload, Shrink, Cloud, Brain, FileText];

const stepColors = [
  { from: 'hsl(76, 73%, 55%)', to: 'hsl(80, 60%, 48%)' },
  { from: 'hsl(80, 60%, 48%)', to: 'hsl(120, 60%, 45%)' },
  { from: 'hsl(120, 60%, 45%)', to: 'hsl(170, 80%, 50%)' },
  { from: 'hsl(170, 80%, 50%)', to: 'hsl(195, 100%, 64%)' },
  { from: 'hsl(195, 100%, 64%)', to: 'hsl(210, 90%, 60%)' },
  { from: 'hsl(210, 90%, 60%)', to: 'hsl(222, 100%, 61%)' },
  { from: 'hsl(222, 100%, 61%)', to: 'hsl(250, 80%, 60%)' },
];

const StepCard = ({ step, index, totalSteps }: { step: { title: string; description: string }; index: number; totalSteps: number }) => {
  const Icon = stepIcons[index];
  const color = stepColors[index];
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={cardRef} className={`flex flex-col lg:flex-row items-center gap-3 lg:gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
      {/* Card side */}
      <div className={`flex-1 w-full ${isLeft ? 'lg:pr-16' : 'lg:pl-16'}`}>
        <motion.div
          className="relative group"
          initial={{ opacity: 0, x: isLeft ? -60 : 60, y: 20 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Card glow on hover */}
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
            style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
          />

          <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl p-4 sm:p-6 overflow-hidden group-hover:border-transparent transition-colors duration-500">
            {/* Subtle background gradient */}
            <div
              className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500"
              style={{ background: `radial-gradient(ellipse at ${isLeft ? '100%' : '0%'} 50%, ${color.from}, transparent 70%)` }}
            />

            {/* Top row: number + icon + title */}
            <div className="relative flex items-center gap-3 sm:gap-4 mb-3">
              {/* Mobile step number */}
              <motion.div
                className="lg:hidden flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-background"
                style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                animate={isInView ? { boxShadow: [`0 0 0px ${color.from}`, `0 0 20px ${color.from}`, `0 0 0px ${color.from}`] } : {}}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {index + 1}
              </motion.div>

              {/* Icon */}
              <motion.div
                className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon className="w-5 h-5 sm:w-5 sm:h-5 text-background" />
              </motion.div>

              <h3 className="font-bold text-foreground text-xs sm:text-sm leading-tight flex-1">
                {step.title}
              </h3>
            </div>

            <p className="relative text-muted-foreground text-xs sm:text-sm leading-relaxed">
              {step.description}
            </p>

            {/* Progress indicator */}
            <div className="relative mt-4 flex items-center gap-2">
              <div className="flex-1 h-[2px] rounded-full bg-border/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color.from}, ${color.to})` }}
                  initial={{ width: '0%' }}
                  animate={isInView ? { width: '100%' } : {}}
                  transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {index + 1}/{totalSteps}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Center timeline node (desktop) */}
      <div className="hidden lg:flex flex-col items-center relative z-10">
        <motion.div
          className="relative w-14 h-14 xl:w-16 xl:h-16 rounded-full flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={isInView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${color.from}`, opacity: 0.5 }}
          />

          {/* Inner circle */}
          <div className="absolute inset-2 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}>
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <span className="text-lg xl:text-xl font-bold" style={{ color: color.from }}>
                {index + 1}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Empty side */}
      <div className="flex-1 hidden lg:block" />
    </div>
  );
};

const HowItWorksSection = () => {
  const { t, locale } = useLanguage();
  const steps = locale.howItWorks.steps;
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const timelineProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);

  return (
    <section ref={sectionRef} id="como-funciona" className="py-16 sm:py-20 lg:py-28 bg-card relative overflow-hidden">
      {/* Background effects */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-iscout-lime/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-iscout-cyan/5 rounded-full blur-[120px]" />
      </motion.div>

      <div className="section-container relative z-10">
        {/* Header */}
        <ScrollReveal animation="fadeInUp">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-iscout-lime/10 text-iscout-lime text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              {t('howItWorks.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-helvetica-neue mb-4 sm:mb-6">
              {t('howItWorks.title')}{' '}
              <span className="gradient-text-iscout">{t('howItWorks.titleHighlight')}</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
              {t('howItWorks.description')}
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Animated vertical timeline line (desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[3px] hidden lg:block -translate-x-1/2">
            {/* Background track */}
            <div className="absolute inset-0 rounded-full bg-border/20" />

            {/* Animated fill */}
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-full origin-top"
              style={{
                scaleY: timelineProgress,
                background: 'linear-gradient(180deg, hsl(76, 73%, 55%) 0%, hsl(170, 80%, 50%) 30%, hsl(195, 100%, 64%) 60%, hsl(222, 100%, 61%) 100%)',
              }}
            />

            {/* Glow overlay */}
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-full origin-top blur-md opacity-50"
              style={{
                scaleY: timelineProgress,
                background: 'linear-gradient(180deg, hsl(76, 73%, 55%) 0%, hsl(195, 100%, 64%) 50%, hsl(222, 100%, 61%) 100%)',
              }}
            />

            {/* Moving particle along timeline */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-iscout-lime"
              style={{
                top: useTransform(timelineProgress, [0, 1], ['0%', '100%']),
                boxShadow: '0 0 15px hsl(76, 73%, 55%), 0 0 30px hsl(76, 73%, 55%)',
              }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-4 sm:space-y-8 lg:space-y-12">
            {steps.map((step, index) => (
              <StepCard key={index} step={step} index={index} totalSteps={steps.length} />
            ))}
          </div>
        </div>

        {/* Bottom highlight card */}
        <ScrollReveal animation="scaleIn" delay={0.3}>
          <div className="text-center mt-12 sm:mt-16 lg:mt-20">
            <motion.div
              className="relative inline-block max-w-2xl w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Card glow */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-iscout-lime/40 via-iscout-cyan/30 to-iscout-blue/40 blur-sm" />

              <div className="relative glass-card p-5 sm:p-6 lg:p-8 border-iscout-lime/30 rounded-2xl">
                <motion.p
                  className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold gradient-text-iscout mb-2 sm:mb-4"
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  viewport={{ once: true }}
                >
                  {t('howItWorks.timeHighlight')}
                </motion.p>
                <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                  {t('howItWorks.timeDescription')}
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div className="text-center mt-8 sm:mt-12">
            <motion.button
              onClick={(e) => e.preventDefault()}
              className="btn-secondary inline-flex text-sm sm:text-base cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t('howItWorks.cta')}
            </motion.button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowItWorksSection;
