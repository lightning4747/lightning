import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-center">
      <div
        onClick={toggleTheme}
        className={`
          relative w-[80px] h-[40px] rounded-full cursor-pointer p-1 transition-all duration-500
          ${isDark 
            ? 'bg-[#141414] shadow-[5px_5px_10px_rgba(0,0,0,0.5),-2px_-2px_10px_rgba(255,255,255,0.05)]' 
            : 'bg-[#F8F7F4] shadow-[5px_5px_10px_rgba(0,0,0,0.05),-2px_-2px_10px_rgba(255,255,255,0.8)]'}
        `}
      >
        {/* Inner Border mimicking the neumorphic inset */}
        <div className={`
          absolute inset-0 rounded-full transition-all duration-500
          ${isDark 
            ? 'shadow-[inset_2px_2px_5px_rgba(0,0,0,0.8),inset_-2px_-2px_5px_rgba(255,255,255,0.05)]' 
            : 'shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]'}
        `} />

        {/* Rolling Toggle Handle */}
        <motion.div
          animate={{
            x: isDark ? 40 : 0,
            rotate: isDark ? 360 : 0,
            backgroundColor: isDark ? '#141414' : '#F5C842',
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8 // faster animation
          }}
          className={`
            relative w-8 h-8 rounded-full flex items-center justify-center z-10
            shadow-[2px_2px_5px_rgba(0,0,0,0.2),-1px_-1px_5px_rgba(255,255,255,0.1)]
            ${isDark ? 'border border-white/5' : 'border border-black/5'}
          `}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.div
                key="moon"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 text-[#4ECDC4]" fill="#4ECDC4" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ opacity: 0, scale: 0.5, rotate: 90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: -90 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-white" fill="white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Atmosphere/Glow details for neumorphic depth */}
        <div className={`
          absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500
          ${isDark ? 'opacity-20 shadow-[0_0_15px_rgba(78,205,196,0.3)]' : 'opacity-40 shadow-[0_0_15px_rgba(245,200,66,0.4)]'}
        `} />
      </div>
    </div>
  );
};
