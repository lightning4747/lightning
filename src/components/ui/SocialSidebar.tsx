import React from 'react';
import { motion } from 'framer-motion';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTheme } from '../../hooks/useTheme';

export const SocialSidebar: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const socials = [
    { 
      icon: EmailRoundedIcon, 
      href: "mailto:vignesh112847@gmail.com", 
      label: "Email",
      color: isDarkMode ? "hover:text-[#4ecdc4]" : "hover:text-blue-600",
      size: 20
    },
    { 
      icon: GitHubIcon, 
      href: "https://github.com/lightning4747", 
      label: "GitHub",
      color: isDarkMode ? "hover:text-[#4ecdc4]" : "hover:text-slate-900",
      size: 19
    },
    { 
      icon: LinkedInIcon, 
      href: "https://www.linkedin.com/in/vignesh-t-43a998341/", 
      label: "LinkedIn",
      color: isDarkMode ? "hover:text-[#4ecdc4]" : "hover:text-blue-700",
      size: 21
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="fixed bottom-0 left-6 md:left-10 z-[100] hidden sm:flex flex-col items-center gap-6"
    >
      <div className="flex flex-col gap-6 mb-4">
        {socials.map((social, index) => (
          <motion.a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            className={`transition-colors duration-300 ${isDarkMode ? "text-slate-500" : "text-slate-400"} ${social.color}`}
            aria-label={social.label}
          >
            <social.icon style={{ fontSize: social.size }} />
          </motion.a>
        ))}
      </div>
      
      {/* Decorative vertical line */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 40 }}
        transition={{ delay: 2.5, duration: 1 }}
        className={`w-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}
      />
    </motion.div>
  );
};
