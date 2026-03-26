import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LaunchIcon from '@mui/icons-material/Launch';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
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
    image: "public/assets/projects/sateless.png",
    accent: "#E8645A",
  },
  {
    title: "The Final Cut",
    desc: "A specialized video processing application built for precision editing and performance-optimized rendering workflows.",
    techStack: "Serverless, NODE.JS, REACT.JS",
    github: "https://github.com/lightning4747/The-Final-Cut",
    image: "public/assets/projects/final-cut-preview.png",
    accent: "#5DBE89",
  },
  {
    title: "Convolutional Neural Network",
    desc: "Semi-Supervised Classification with Graph Convolutional Networks (GCN).",
    techStack: "PYTHON, PYTORCH, GEOMETRIC",
    github: "https://github.com/lightning4747",
    image: "public/assets/projects/gnn-research.png",
    accent: "#F5C842",
  },
];

const OTHER_PROJECTS = [
  {
    title: "Real-Time Fraud Intelligence",
    desc: "A serverless pipeline for detecting fraudulent transactions in real-time using AWS streaming services.",
    tech: "AWS Lambda, Neptune, Python",
    github: "https://github.com/lightning4747/Serverless-Real-Time-Fraud-Intelligence",
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
    title: "University Management",
    desc: "An enterprise-level system for managing student records, faculty schedules, and academic auditing.",
    tech: "PostgreSQL, Node.js, React.js, Express",
    github: "https://github.com/lightning4747/Full-scale-University-Management-System",
  },
  {
    title: "Snake Java Edition",
    desc: "The classic arcade experience rebuilt with a focus on OOP principles and clean GUI implementation.",
    tech: "Java, Swing",
    github: "https://github.com/lightning4747/Snake-game-in-java",
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

const FeaturedCard = ({ project, isDarkMode }: any) => {
  const isFinalCut = project.title.includes("The Final Cut");
  const isGCN = project.title.includes("Convolutional Neural Network");

  // Style overrides for specific projects
  const titleColor = isFinalCut ? "#eb79ffff" /* Bright pink */ : (isGCN ? "#fa7070ff" /* Lite Red */ : undefined);
  const textOverride = (isFinalCut || isGCN) ? "text-white" : undefined;

  return (
    <a 
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative w-full h-full rounded-[40px] overflow-hidden group shadow-2xl cursor-pointer"
    >
      <img
        src={project.image}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-125"
        style={{ opacity: isDarkMode ? 0.8 : 1.0 }} 
      />
      <div
        className={`absolute inset-0 transition-opacity duration-500
          ${isDarkMode
            ? "bg-gradient-to-t from-[#141414]/90 via-[#141414]/20 via-40% to-transparent"
            : "bg-gradient-to-t from-white/60 via-white/5 via-30% to-transparent"}`}
      />

      {/* Dark overlay for specific high-brightness projects to ensure text pop if not in dark mode manually */}
      {(isFinalCut || isGCN) && !isDarkMode && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      <div className="absolute inset-0 border-[1.5px] border-white/10 rounded-[40px] pointer-events-none" />

      <div className="absolute bottom-12 left-12 right-12 z-10 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase mb-4 block" style={{ color: project.accent }}>
          {project.techStack}
        </span>
        <h3 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-2"
          style={{ color: titleColor || (isDarkMode ? "#f1f5f9" : "#0f172a") }}
        >
          {project.title}
        </h3>
        <p className={`text-lg max-w-2xl mb-8 leading-relaxed ${textOverride || (isDarkMode ? "text-slate-200" : "text-slate-700")} drop-shadow-lg`}>
          {project.desc}
        </p>
        <ExternalLinks link={project.link} isDarkMode={isDarkMode} />
      </div>
    </a>
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
          className="absolute -inset-[2px] rounded-[26px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-md -z-10"
          style={{ background: conicGradient }}
        />
        <div 
          className="absolute -inset-[1px] rounded-[25px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-[1px] -z-10"
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
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [spotlightProgress, setSpotlightProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!spotlightRef.current) return;
      const rect = spotlightRef.current.getBoundingClientRect();
      const spotlightHeight = spotlightRef.current.offsetHeight - window.innerHeight;

      // Calculate progress specifically within the spotlight container
      const progress = Math.max(0, Math.min(1, -rect.top / spotlightHeight));
      setSpotlightProgress(progress);

      // Map progress to active spotlight index (starting immediately)
      const step = 1 / SPOTLIGHT_PROJECTS.length;
      const index = Math.min(Math.floor(progress / step), SPOTLIGHT_PROJECTS.length - 1);
      setCurrentFeatured(index);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} id="projects" className="relative">

      {/* ─── PHASE 1: SPOTLIGHT ─── */}
      <div
        ref={spotlightRef}
        className="relative"
        style={{ height: "350vh" }}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col items-center overflow-hidden">

          {/* Section Heading */}
          <div className="w-full max-w-7xl pt-16 px-6 md:px-20 z-50">
            <FadeSection direction="down" delay={0.2} className="w-full text-left">
              <div className="section-header mb-16">
                <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
                  / Pet projects
                </span>
              </div>
            </FadeSection>
          </div>

          {/* Cards */}
          <div className="relative w-full max-w-7xl h-[65vh] px-6 mt-8 z-10">
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              {SPOTLIGHT_PROJECTS.map((project, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0"
                  style={{ zIndex: i === currentFeatured ? 10 : 0 }}
                  initial={false}
                  animate={{
                    opacity: i === currentFeatured ? (i === SPOTLIGHT_PROJECTS.length - 1 && spotlightProgress > 0.95 ? 1 - (spotlightProgress - 0.95) * 20 : 1) : 0,
                    x: i === currentFeatured ? 0 : (i < currentFeatured ? -200 : 200),
                    filter: i === currentFeatured ? "blur(0px)" : "blur(40px)",
                    scale: i === currentFeatured ? 1 : 0.9
                  }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FeaturedCard project={project} isDarkMode={isDarkMode} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Indicators */}
          <div
            className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50 transition-opacity duration-300"
            style={{ opacity: spotlightProgress > 0.95 ? 0 : 1 }}
          >
            {SPOTLIGHT_PROJECTS.map((_, i) => (
              <div
                key={i}
                className="w-1 transition-all duration-500"
                style={{
                  height: i === currentFeatured ? "40px" : "12px",
                  backgroundColor: i === currentFeatured
                    ? (isDarkMode ? "var(--accent-primary)" : "var(--accent-blue)")
                    : (isDarkMode ? "#ffffff22" : "#00000011"),
                  borderRadius: "2px"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ─── PHASE 2: ARCHIVE GRID ─── */}
      <div className="relative z-50 py-32 px-6 md:px-20 max-w-7xl mx-auto -mt-[15vh]">
        <div className="mb-16">

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
          {OTHER_PROJECTS.map((project, index) => (
            <ProjectGridItem key={index} project={project} isDarkMode={isDarkMode} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
