import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

const navLinks = [
  { name: 'Hero', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

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
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              whileHover={{ y: -2 }}
              className="relative font-sans text-sm tracking-widest uppercase text-text-secondary hover:text-accent-primary transition-colors duration-300"
            >
              {link.name}
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-primary"
                whileHover={{ width: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </motion.a>
          ))}
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
