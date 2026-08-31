import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bolaGif from '@/assets/bola-flutuante.gif';
import { useContactDialog } from '@/contexts/ContactDialogContext';

/**
 * Balão flutuante com gif da bola girando.
 * Aparece somente após o usuário rolar além da primeira seção (≈ 100vh).
 * Ao clicar, abre o ContactDialog global.
 */
const FloatingContactButton = () => {
  const { openContact } = useContactDialog();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Mostra após passar ~85% da viewport (primeira seção/Hero)
      const threshold = window.innerHeight * 0.85;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Falar com a iSCOUT"
          onClick={openContact}
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 30 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[60] w-16 h-16 sm:w-20 sm:h-20 bg-transparent border-0 p-0 cursor-pointer"
        >
          <img
            src={bolaGif}
            alt=""
            className="w-full h-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingContactButton;
