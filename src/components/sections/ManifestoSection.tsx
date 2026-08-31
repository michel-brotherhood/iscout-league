import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import { useLanguage } from '@/contexts/LanguageContext';
import manifestoVideo from '@/assets/iscout-manifesto.mp4';

const ManifestoSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // bgY parallax removed to prevent overlap with Hero
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section ref={sectionRef} id="manifesto" className="relative z-0 min-h-[auto] lg:min-h-screen flex items-center overflow-hidden py-12 sm:py-20 lg:py-0">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-iscout-darker via-background to-iscout-dark" />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `radial-gradient(circle at 25% 25%, hsl(76 73% 55% / 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(197 100% 64% / 0.1) 0%, transparent 50%)` }} />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <motion.div className="absolute top-1/4 left-0 w-64 h-64 bg-iscout-lime/10 rounded-full blur-3xl" style={{ y: orbY1 }} />
      <motion.div className="absolute bottom-1/4 right-0 w-96 h-96 bg-iscout-cyan/10 rounded-full blur-3xl" style={{ y: orbY2 }} />

      <div className="section-container relative z-10 py-8 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <ScrollReveal animation="fadeIn" delay={0.2}>
            <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-iscout-lime/10 text-iscout-lime text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              {t('manifesto.badge')}
            </span>
          </ScrollReveal>

          {/* Video with decorative frame */}
          <ScrollReveal animation="fadeInUp" delay={0.4}>
            <div className="relative mx-2 sm:mx-auto sm:max-w-[700px] lg:max-w-[900px]">
              {/* Outer glow */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-br from-iscout-lime/8 via-iscout-cyan/6 to-iscout-blue/8 blur-2xl animate-pulse-glow pointer-events-none" />

              {/* Decorative frame with gradient border */}
              <div className="relative rounded-2xl p-[2px] sm:p-[3px] bg-gradient-to-br from-iscout-lime/50 via-iscout-cyan/40 to-iscout-blue/50 shadow-[0_0_30px_rgba(157,255,0,0.08),0_0_60px_rgba(68,199,255,0.06)]">
                {/* Inner background to create border effect */}
                <div className="relative rounded-[14px] sm:rounded-[13px] overflow-hidden bg-background">
                  {/* Video */}
                  <video
                    ref={videoRef}
                    src={manifestoVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video object-cover"
                  />

                  {/* Clickable overlay to toggle sound */}
                  <button
                    onClick={toggleMute}
                    className="absolute inset-0 cursor-pointer z-10"
                    aria-label={isMuted ? t('manifesto.soundCta') : t('manifesto.soundActive')}
                  />

                  {/* Muted indicator - centered, fades out when unmuted */}
                  <AnimatePresence>
                    {isMuted && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                          <VolumeX size={24} className="sm:w-7 sm:h-7 text-white/50 animate-pulse" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Small mute icon - only visible when sound is active */}
                  <AnimatePresence>
                    {!isMuted && (
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white/90 hover:bg-black/50 transition-colors duration-200 cursor-pointer z-20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        aria-label={t('manifesto.soundActive')}
                      >
                        <Volume2 size={16} className="sm:w-5 sm:h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Tech corner accents */}
              <div className="absolute -top-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-iscout-lime/60 rounded-tl-sm pointer-events-none" />
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-iscout-cyan/60 rounded-tr-sm pointer-events-none" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-iscout-cyan/60 rounded-bl-sm pointer-events-none" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-iscout-lime/60 rounded-br-sm pointer-events-none" />
            </div>
          </ScrollReveal>

          {/* Section title below video */}
          <ScrollReveal animation="fadeInUp" delay={0.6}>
            <h2 className="mt-8 sm:mt-10 lg:mt-12 text-2xl sm:text-3xl lg:text-4xl font-bold font-helvetica-neue gradient-text-iscout text-center leading-tight text-balance max-w-3xl mx-auto px-4">
              <span className="whitespace-nowrap">O talento está em todo lugar.</span>{' '}
              <span className="whitespace-nowrap">A oportunidade, não.</span>
            </h2>
          </ScrollReveal>

          {/* Decorative gradient line */}
          <motion.div
            className="mt-8 sm:mt-12 mx-auto w-32 h-1 bg-gradient-to-r from-iscout-lime via-iscout-cyan to-iscout-blue rounded-full"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-iscout-lime/40 rounded-full"
            style={{ left: `${15 + i * 25}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
        ))}
      </div>
    </section>
  );
};

export default ManifestoSection;
