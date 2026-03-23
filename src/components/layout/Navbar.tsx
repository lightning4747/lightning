import { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

const navLinks = [
  { name: 'Hero', href: '#hero', color: 'var(--accent-blue)' },
  { name: 'About', href: '#about', color: 'var(--accent-green)' },
  { name: 'Skills', href: '#skills', color: 'var(--accent-primary)' },
  { name: 'Experience', href: '#experience', color: 'var(--accent-yellow)' },
  { name: 'Projects', href: '#projects', color: 'var(--accent-red)' },
  { name: 'Contact', href: '#contact', color: 'var(--accent-primary)' }
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled ? 'py-4 glass-effect' : 'py-8 bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#top"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 group"
        >
          <div className="relative">
            <Zap className="w-8 h-8 text-accent-primary transition-colors duration-300" />
            <motion.div
              layoutId="logo-glow"
              className="absolute inset-0 bg-accent-primary blur-lg opacity-0 group-hover:opacity-40"
            />
          </div>
          <span className="font-display text-2xl tracking-tighter text-text-primary hidden sm:block">
            LIGHTNING
          </span>
        </motion.a>

        {/* Desktop Nav Links */}
        <div 
          className="hidden md:flex items-center gap-8"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navLinks.map((link, i) => {
            const isHovered = hoveredIndex === i;
            const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1;
            
            return (
              <motion.a
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHoveredIndex(i)}
                animate={{
                  y: isHovered ? -4 : (isNeighbor ? -2 : 0),
                  scale: isHovered ? 1.1 : (isNeighbor ? 1.05 : 1),
                  color: isHovered ? link.color : 'var(--text-secondary)',
                  fontWeight: isHovered ? 700 : 400,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 800, // significantly faster
                  damping: 35,
                  mass: 0.5
                }}
                className="relative flex flex-col items-center font-sans text-xs tracking-[0.2em] uppercase transition-colors duration-150"
              >
                {link.name}
                
                {/* 
                  Shared Layout underline for smooth tracking. 
                  Removed AnimatePresence to ensure the indicator slides instantly between items.
                */}
                {isHovered && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute -bottom-2 w-full h-[2px] rounded-full"
                    style={{ backgroundColor: link.color, boxShadow: `0 0 12px ${link.color}` }}
                    transition={{
                      type: 'spring',
                      stiffness: 1000,
                      damping: 40
                    }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Mobile Menu Placeholder - can be expanded later */}
          <button className="md:hidden p-2 text-text-primary">
            <div className="w-6 h-0.5 bg-current mb-1" />
            <div className="w-6 h-0.5 bg-current" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};
