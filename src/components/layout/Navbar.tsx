import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [isLogoClicked, setIsLogoClicked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
 
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const handleLogoClick = () => {
    setIsLogoClicked(true);
    setTimeout(() => setIsLogoClicked(false), 1000); // 1s flash effect
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const sectionId = id.replace('#', '');

    if (location.pathname !== '/') {
      // If not on home page, navigate to home and pass the ID
      navigate('/', { state: { scrollTo: sectionId } });
      // The scroll will be handled in a useEffect on the home page or via URL hash
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const COLORS = ["#E8645A", "#F5C842", "#5B9CF6", "#5DBE89", "#eb79ff"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`
        fixed top-0 left-0 right-0 z-[9999] transition-all duration-500
        ${isScrolled ? 'py-4 glass-effect' : 'py-8 bg-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 group cursor-pointer select-none"
        >
          <motion.span 
            className="font-display text-2xl text-text-primary hidden sm:flex"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {"Vignesh".split("").map((char, index) => (
              <motion.span
                key={index}
                animate={{ 
                  color: isLogoClicked 
                    ? COLORS[index % COLORS.length] 
                    : "inherit" 
                }}
                whileHover={{ 
                  color: COLORS[index % COLORS.length],
                  y: -2,
                }}
                transition={{ duration: 0.2 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.span>
        </div>

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
                onClick={(e) => scrollToSection(e, link.href)}
                onMouseEnter={() => setHoveredIndex(i)}
                animate={{
                  y: isHovered ? -4 : (isNeighbor ? -2 : 0),
                  scale: isHovered ? 1.1 : (isNeighbor ? 1.05 : 1),
                  color: isHovered ? link.color : 'var(--text-secondary)',
                  fontWeight: isHovered ? 800 : 600,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 800, // significantly faster
                  damping: 35,
                  mass: 0.5
                }}
                className="relative flex flex-col items-center font-sans text-sm tracking-[0.15em] uppercase transition-colors duration-150"
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
