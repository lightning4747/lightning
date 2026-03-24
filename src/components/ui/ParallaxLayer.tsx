import { type ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  strength?: number; // Strength of mouse parallax (e.g. 50-100)
  scrollFactor?: number; // Factor for scroll parallax (e.g. 0.2)
  isMouseControlled?: boolean;
}

export const ParallaxLayer = ({
  children,
  className = '',
  strength = 60,
  scrollFactor = 0,
  isMouseControlled = true
}: ParallaxLayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Springs for Mouse
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Scroll Transforms
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, scrollFactor * 400]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseControlled) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize mouse position to range [-0.5, 0.5]
    const x = (clientX / innerWidth) - 0.5;
    const y = (clientY / innerHeight) - 0.5;
    
    mouseX.set(x * strength);
    mouseY.set(y * strength);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          x: isMouseControlled ? springX : 0,
          y: isMouseControlled ? springY : scrollY,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};
