import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import { useTheme } from '../../hooks/useTheme';

const SECTIONS = [
  { id: 'hero', icon: HomeRoundedIcon, label: 'Home', color: '#5B9CF6' },
  { id: 'about', icon: PersonRoundedIcon, label: 'About', color: '#5DBE89' },
  { id: 'skills', icon: ConstructionRoundedIcon, label: 'Skills', color: '#F5C842' },
  { id: 'experience', icon: BusinessCenterRoundedIcon, label: 'Experience', color: '#E8645A' },
  { id: 'projects', icon: FolderOpenRoundedIcon, label: 'Projects', color: '#5B9CF6' },
  { id: 'contact', icon: EmailRoundedIcon, label: 'Contact', color: '#5DBE89' },
];

export const SectionNavigator: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // Outer div handles ONLY fixed positioning + centering — no transforms from framer here
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 h-fit z-[9999] hidden lg:block">
      {/* Inner motion.div handles ONLY the fade-in entrance animation */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="flex flex-col items-center relative"
      >
        {/* Vertical Track Line */}
        <div
          className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] ${
            isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        />

        <div className="flex flex-col gap-7 relative py-2">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            const activeColor = isDarkMode ? 'var(--accent-primary)' : section.color;

            return (
              <div key={section.id} className="relative flex items-center justify-center">
                {/* Tooltip Label */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      key="tooltip"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-full mr-3 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-widest uppercase pointer-events-none whitespace-nowrap
                        ${isDarkMode
                          ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                          : 'bg-white border border-slate-200 shadow-sm'}`}
                      style={{ color: !isDarkMode ? section.color : undefined }}
                    >
                      {section.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Icon Button */}
                <button
                  onClick={() => scrollToSection(section.id)}
                  className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  aria-label={`Navigate to ${section.label}`}
                >
                  {/* Glow Ring */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute inset-0 rounded-full blur-md opacity-50"
                      style={{ backgroundColor: activeColor }}
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      color: isActive
                        ? activeColor
                        : isDarkMode
                        ? '#334155'
                        : '#cbd5e1',
                    }}
                    transition={{ duration: 0.25 }}
                    className="relative z-10 pointer-events-none"
                  >
                    <Icon style={{ fontSize: 19 }} />
                  </motion.div>
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
