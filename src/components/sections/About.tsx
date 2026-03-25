import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { FadeSection } from "../ui/FadeSection";

export const About: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const techStack = [
    "Typescript", "Express", "Java", "PostgreSQL", "React.js", "Python"
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const shadowOffset = mousePos.active ? {
    x: -(mousePos.x - 128) / 6,
    y: -(mousePos.y - 160) / 6,
    opacity: 0.6
  } : { x: -4, y: 10, opacity: 0.2 };

  const imageSrc = "/assets/WhatsApp Image 2026-03-25 at 8.24.21 PM (1).jpeg";

  return (
    <section id="about" className="py-24 px-6 md:px-10 max-w-6xl mx-auto min-h-[80vh] flex flex-col justify-center">
      
      {/* GLOBAL SVG DEFINITIONS (Filter + Mask) */}
      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <filter id="liquid-glitch">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="25" />
          </filter>
          
          <mask id="wavy-mask">
            <rect width="100%" height="100%" fill="black" />
            {/* The circle that reveals the image, with liquid filter applied to its shape */}
            <circle 
              cx={mousePos.x} 
              cy={mousePos.y} 
              r="45" 
              fill="white" 
              filter="url(#liquid-glitch)" 
            />
          </mask>
        </defs>
      </svg>

      <FadeSection direction="down" delay={0.2}>
        <div className="section-header mb-12">
          <span className={`text-2xl font-mono tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
            / about me
          </span>
        </div>
      </FadeSection>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* LEFT SIDE: Image Container */}
        <FadeSection direction="right" delay={0.4}>
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => {
              setMousePos(prev => ({ ...prev, active: true }));
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setMousePos(prev => ({ ...prev, active: false }));
              setIsHovered(false);
            }}
            className="relative group cursor-crosshair"
          >
            {/* Main Image Container */}
            <motion.div 
              animate={{ 
                boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px 30px ${
                  isDarkMode 
                    ? `rgba(78, 205, 196, ${shadowOffset.opacity})` 
                    : `rgba(59, 130, 246, ${shadowOffset.opacity})`
                }`
              }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              className={`relative z-10 w-64 h-80 overflow-hidden rounded-lg border-2 transition-colors duration-500
                ${isDarkMode ? "border-accent-primary/50" : "border-blue-100"}`}
            >
              {/* Base Image (Always visible) */}
              <img 
                src={imageSrc} 
                alt="Vignesh T" 
                className="w-full h-full object-cover relative z-10"
              />

              {/* Localized "Wavy Mask" Reveal - Light Theme Only */}
              <AnimatePresence>
                {isHovered && !isDarkMode && (
                  <>
                    {/* The Color Lump backdrop */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 0.6, 
                        scale: 1,
                        x: mousePos.x - 55,
                        y: mousePos.y - 55
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute z-20 pointer-events-none blur-2xl rounded-full"
                      style={{
                        width: '110px',
                        height: '110px',
                        background: `radial-gradient(circle, #E8645A, #F5C842, #5B9CF6, #5DBE89)`
                      }}
                    />

                    {/* The Reveal Container (uses SVG Mask for wavy edges) */}
                    <div
                      className="absolute inset-0 z-30 pointer-events-none w-full h-full"
                      style={{
                         mask: "url(#wavy-mask)",
                         WebkitMask: "url(#wavy-mask)"
                      }}
                    >
                      {/* Distorted Image inside the reveal area */}
                      <motion.img
                        animate={{ 
                          x: [-2, 2, 0],
                          filter: ["hue-rotate(0deg) saturate(3) brightness(1.2)", "hue-rotate(90deg) saturate(3) brightness(1.2)"]
                        }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        src={imageSrc}
                        className="w-64 h-80 object-cover absolute top-0 left-0 mix-blend-multiply opacity-95"
                      />
                    </div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Decorative Back-frame */}
            <div className={`absolute -bottom-4 -left-4 w-full h-full -z-10 rounded-lg transition-colors duration-500
              ${isDarkMode ? "bg-slate-800/50" : "bg-blue-50/50"}`} 
            />
          </div>
        </FadeSection>

        {/* RIGHT SIDE: Text Content */}
        <div className="flex-1 space-y-6">
          <div className={`about-description space-y-4 p-2 transition-all duration-500 
            ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>
            
            <p className="text-lg leading-relaxed">
              I am currently a <b>Software Engineer Intern</b> at 
              <a href="https://eanstall.com" target="_blank" rel="noopener noreferrer" className={`mx-1 font-bold ${isDarkMode ? "text-accent-primary hover:text-white" : "text-blue-600 hover:text-blue-800"}`}> EANS Technologies</a>, 
              where I help build backend architectures that scale. Previously, I've worked on managing platforms with 
              <b> 400k+ images</b> and optimized high-performance services. At the same time, I am pursuing my 
              <b> B.Tech</b> in <b>Computer Science</b> at <b>MCET</b>.
            </p>

            <p className="text-lg leading-relaxed">
              Outside of work, I’m nerdy about tech gadgets, research <b>Graph Neural Networks</b> for fraud detection, 
              and play way too many souls games. Oh, and I enjoy crafting immersive digital experiences.
            </p>

            <div className="pt-4">
              <p className={`mb-4 font-mono text-sm tracking-tight ${isDarkMode ? "text-accent-primary" : "text-blue-600"}`}>
                // Technologies I’ve been working with:
              </p>
              <ul className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                {techStack.map((tech, i) => {
                  const palette = ['#E8645A', '#F5C842', '#5B9CF6', '#5DBE89'];
                  const brandColor = palette[i % palette.length];
                  
                  // Use explicit theme-neutral base color for Framer Motion to animate FROM
                  const baseColor = isDarkMode ? '#94A3B8' : '#334155'; // slate-400 / 700

                  return (
                    <FadeSection key={`${theme}-${i}`} direction="up" delay={0.1 + (i * 0.05)}>
                      <motion.li
                        animate={{ color: baseColor }} // theme-reactive base
                        whileHover={{
                          x: 5,
                          color: brandColor,
                          transition: { duration: 0.2 }
                        }}
                        className="flex items-center gap-2 text-sm font-mono font-bold cursor-default group"
                      >
                        <span
                          className="shrink-0 transition-transform duration-300 group-hover:scale-125"
                          style={{ color: brandColor }}
                        >
                          ▹
                        </span>
                        <b>{tech}</b>
                      </motion.li>
                    </FadeSection>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
