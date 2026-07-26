import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LaunchIcon from '@mui/icons-material/Launch';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTheme } from "../../hooks/useTheme";
import { FadeSection } from "../ui/FadeSection";
import BorderGlow from "../ui/BorderGlow";

/* ─── Project Data ─────────────────────────────────────────────────────────── */

const SPOTLIGHT_PROJECTS = [
  {
    title: "Stateless",
    desc: "A high-performance stateless authentication system designed for distributed architectures, focusing on security and horizontal scalability.",
    techStack: "REACT.JS, NODE.JS, Puter",
    github: "https://github.com/lightning4747/Stateless",
    link: "https://puter.com/app/stateless",
    image: import.meta.env.BASE_URL + "assets/projects/sateless.png",
    accent: "#E8645A",
  },
  {
    title: "The Final Cut",
    desc: "A specialized video processing application built for precision editing and performance-optimized rendering workflows.",
    techStack: "Serverless, NODE.JS, REACT.JS",
    github: "https://github.com/lightning4747/The-Final-Cut",
    image: import.meta.env.BASE_URL + "assets/projects/final-cut-preview.png",
    accent: "#5DBE89",
  },
  {
    title: "Convolutional Neural Network",
    desc: "Semi-Supervised Classification with Graph Convolutional Networks (GCN).",
    techStack: "PYTHON, PYTORCH, GEOMETRIC",
    github: "https://github.com/lightning4747",
    image: import.meta.env.BASE_URL + "assets/projects/gnn-research.png",
    accent: "#F5C842",
  },
];

const OTHER_PROJECTS = [
  {
    title: "Search Engine",
    desc: "A high-performance positional search engine featuring custom VByte compression, PageRank authority ranking, Damerau-Levenshtein spell checking, and live Elasticsearch benchmarking.",
    tech: "TypeScript, React, Node.js, PostgreSQL, Elasticsearch",
    github: "https://github.com/lightning4747/Search-Engine",
  },
  {
    title: "Restaurant Full-Stack",
    desc: "A complete management ecosystem for restaurants featuring real-time ordering and inventory tracking.",
    tech: "React, Node.js, MongoDB, Express",
    github: "https://github.com/lightning4747/Restaurant-",
  },
  {
    title: "Luminary",
    desc: "A light-weight UI/UX exploration focused on modern lighting and atmospheric design patterns.",
    tech: "React, Tailwind, Framer Motion",
    github: "https://github.com/lightning4747/Luminary",
  },
  {
    title: "Live Canvas",
    desc: "A digital interactive canvas for visual exploration, creative rendering, and real-time collaborative design.",
    tech: "Next.js, TypeScript, PixiJS, Socket.io, Node.js",
    github: "https://github.com/lightning4747/live-canvas",
  },
  {
    title: "Linux Rice Setup",
    desc: "A customized Unix desktop environment and ricing configuration optimized for workflow efficiency, minimalist aesthetics, and terminal productivity.",
    tech: "Linux, Bash, Dotfiles, Shell",
    github: "https://github.com/lightning4747/rice",
  },
  {
    title: "Arcana Vision",
    desc: "A computer vision experiment identifying and cataloging symbolic data within live video feeds.",
    tech: "Javascript, Three js",
    github: "https://github.com/lightning4747/Arcana-vision",
  },
];

const LIGHT_PALETTE = ['#E8645A', '#F5C842', '#5B9CF6', '#5DBE89'];

/* ─── Components ─────────────────────────────────────────────────────────── */

const ExternalLinks = ({ link, isDarkMode }: any) => (
  <div className="flex gap-4 items-center">
    {link && (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-110 relative z-20 pointer-events-auto"
        style={{ color: isDarkMode ? "var(--text-secondary)" : "var(--text-muted)" }}
      >
        <LaunchIcon style={{ fontSize: 20 }} className="hover:text-accent-primary transition-colors" />
      </a>
    )}
  </div>
);

const FeaturedCard = ({ project }: any) => {

  const isStateless = project.title === "Stateless";

  return (
    <div className="block relative w-full h-full overflow-hidden group shadow-2xl">

      <a 
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10" // Covers the whole card
        aria-label={`View ${project.title} on GitHub`}
      />

<img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />

      {!isStateless && (
        <>
          <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </>
      )}
      
      <div className="absolute inset-0 border border-white/10 rounded-[inherit] pointer-events-none" />

      <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 z-10 pointer-events-none">
        <div className="flex flex-col gap-1 md:gap-2">
          
          {/* Tech Stack: Swap to black text and remove the accent color if it's Stateless */}
          <span 
            className={`font-mono text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-bold ${isStateless ? 'text-black' : 'text-white/80'}`} 
            style={isStateless ? {} : { color: project.accent }}
          >
            {project.techStack}
          </span>
          
          {/* Title: Swapped to black text if Stateless */}
          <h3 className={`text-2xl md:text-4xl lg:text-5xl font-display font-black tracking-tight mb-1 ${isStateless ? 'text-black' : 'text-white'}`}>
            {project.title}
          </h3>
          
          {/* Description: Swapped to black text if Stateless, removing the drop-shadow as well */}
          <p className={`text-xs md:text-base max-w-xl line-clamp-2 md:line-clamp-none font-bold leading-relaxed ${isStateless ? 'text-black' : 'text-white/90 drop-shadow-md'}`}>
            {project.desc}
          </p>
          
          <div className="mt-3">
             {/* Passed !isStateless to flip the icon color to dark if the text is black */}
            <ExternalLinks link={project.link} isDarkMode={!isStateless} />
          </div>
        </div>
      </div>
</div>
    
  );
};

const ProjectGridItem = ({ project, isDarkMode, index }: any) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const conicGradient = `conic-gradient(from ${rotation}deg, ${LIGHT_PALETTE[0]}, ${LIGHT_PALETTE[1]}, ${LIGHT_PALETTE[2]}, ${LIGHT_PALETTE[3]}, ${LIGHT_PALETTE[0]})`;

  return (
    <FadeSection direction="up" delay={index * 0.1} distance={20}>
      <a 
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full group relative cursor-pointer"
      >
<div 
  className="absolute -inset-[2px] rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md -z-10 animate-conic-spin"
  style={{ background: conicGradient }}
/>

        <BorderGlow
          borderRadius={24}
          glowColor={isDarkMode ? "180 80 80" : "215 91 66"}
          backgroundColor={isDarkMode ? "#1c1c1c" : "#ffffff"}
          glowIntensity={1.5}
          glowRadius={60}
          animated={true}
          className="h-full"
        >
          <div className="p-8 h-full flex flex-col relative z-10">
            <div className="flex justify-between items-start mb-8">
              <FolderOpenRoundedIcon style={{ fontSize: 35, color: isDarkMode ? "var(--accent-primary)" : "#3b82f6" }} />
              <ExternalLinks link={project.link} isDarkMode={isDarkMode} />
            </div>
            <h4 className={`text-xl font-display font-bold tracking-tight mb-4 transition-colors group-hover:text-accent-primary ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
              {project.title}
            </h4>
            <p className={`${isDarkMode ? "text-slate-400" : "text-slate-600"} text-sm leading-relaxed mb-6 flex-grow`}>
              {project.desc}
            </p>
            <div className={`font-mono text-[9px] tracking-widest uppercase ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              {project.tech}
            </div>
          </div>
        </BorderGlow>
      </a>
    </FadeSection>
  );
};

/* ─── Main Section ─────────────────────────────────────────────────────────── */

export const Projects: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextProject = () => {
    setDirection(1);
    setCurrentFeatured((prev) => (prev + 1) % SPOTLIGHT_PROJECTS.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setCurrentFeatured((prev) => (prev - 1 + SPOTLIGHT_PROJECTS.length) % SPOTLIGHT_PROJECTS.length);
  };

  // Auto-play (optional, but nice for a carousel)
  useEffect(() => {
    const timer = setInterval(nextProject, 8000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      zIndex: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
    }),
  };

  return (
    <div id="projects" className="relative py-20">
      
      {/* ─── PHASE 1: SPOTLIGHT CAROUSEL ─── */}
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <FadeSection direction="down" delay={0.2}>
          <div className="section-header mb-12">
            <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
              / Pet projects
            </span>
          </div>
        </FadeSection>

        <div className="relative group">
          {/* Carousel Container */}
          <div className="relative h-[55vh] md:h-[60vh] overflow-hidden rounded-[40px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentFeatured}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "tween", duration: 0.6, ease: [0.25, 1, 0.5, 1] }
                }}
                style={{ willChange: "transform" }} 
                className="absolute inset-0"
              >
                <FeaturedCard 
                  project={SPOTLIGHT_PROJECTS[currentFeatured]} 
                  isDarkMode={isDarkMode} 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevProject}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full 
              backdrop-blur-md border border-white/10 transition-all
              ${isDarkMode ? "bg-black/20 hover:bg-black/40 text-white" : "bg-white/20 hover:bg-white/40 text-slate-800"}
              opacity-0 group-hover:opacity-100 hidden md:block`}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
          
          <button
            onClick={nextProject}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full 
              backdrop-blur-md border border-white/10 transition-all
              ${isDarkMode ? "bg-black/20 hover:bg-black/40 text-white" : "bg-white/20 hover:bg-white/40 text-slate-800"}
              opacity-0 group-hover:opacity-100 hidden md:block`}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {SPOTLIGHT_PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentFeatured ? 1 : -1);
                  setCurrentFeatured(i);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentFeatured 
                    ? (isDarkMode ? "w-8 bg-accent-primary" : "w-8 bg-blue-500") 
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── PHASE 2: ARCHIVE GRID ─── */}
      <div className="max-w-7xl mx-auto px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {OTHER_PROJECTS.map((project, index) => (
            <ProjectGridItem 
              key={index} 
              project={project} 
              isDarkMode={isDarkMode} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
