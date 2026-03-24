import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FadeSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
}

export const FadeSection = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 30,
  once = true
}: FadeSectionProps) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  };

  const initial = {
    opacity: 0,
    ...directions[direction]
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0
      }}
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] // Apple-style smooth ease-out
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
