import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  direction?: 'up' | 'down';
  className?: string;
  offset?: [number, number];
}

const speedConfig = {
  slow: 50,
  medium: 100,
  fast: 150,
};

const ParallaxLayer = ({ 
  children, 
  speed = 'medium', 
  direction = 'up',
  className = '',
  offset
}: ParallaxLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset || ["start end", "end start"]
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const distance = speedConfig[speed];
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, distance * multiplier]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxLayer;
