import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { FadeSection } from "../ui/FadeSection";
import BorderGlow from "../ui/BorderGlow";

interface ExperienceItem {
  company: string;
  jobTitle: string;
  duration: string;
  desc: string[];
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    company: "EANS Technologies",
    jobTitle: "Backend Engineering Intern @",
    duration: "FEB 2026 - PRESENT",
    desc: [
      "Architected and deployed a scalable backend infrastructure for a textile-industry SaaS, managing a repository of over 400,000 image assets.",
      "Engineered event-driven data pipelines using AWS S3 and Lambda to automate image processing and metadata extraction, significantly reducing manual overhead.",
      "Optimized relational database performance and storage costs by implementing efficient PostgreSQL indexing and S3 lifecycle policies for high-frequency assets.",
      "Developed robust RESTful APIs using the PERN (PostgreSQL, Express, React, Node.js) stack to support enterprise-level inventory and asset tracking features."
    ],
  },
];

const LIGHT_PALETTE = ['#E8645A', '#F5C842', '#5B9CF6', '#5DBE89'];

export const Experience: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [activeIndex, setActiveIndex] = useState(0);

  const activeJob = EXPERIENCE_DATA[activeIndex];

  return (
    <section id="experience" className="py-24 px-6 md:px-10 max-w-5xl mx-auto min-h-[80vh] flex flex-col justify-center overflow-visible">
      <FadeSection direction="down" delay={0.2}>
        <div className="section-header mb-16">
          <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
            / experience
          </span>
        </div>
      </FadeSection>

      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-12 min-h-[450px]">
        {/* LEFTSIDE: Company Selectors */}
        <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar pb-4 md:pb-0 md:border-l border-slate-200/20">
          {EXPERIENCE_DATA.map((job, i) => {
            const isActive = activeIndex === i;
            const accentColor = LIGHT_PALETTE[i % LIGHT_PALETTE.length];

            return (
              <button
                key={job.company}
                onClick={() => setActiveIndex(i)}
                className={`relative px-6 py-4 text-left whitespace-nowrap font-mono text-sm tracking-widest transition-all duration-300 border-b-2 md:border-b-0 md:border-l-2 group
                  ${isActive 
                    ? (isDarkMode ? "text-accent-primary border-accent-primary bg-accent-primary/5" : `text-blue-600 border-blue-600 bg-blue-50/50`) 
                    : "text-slate-500 border-transparent hover:bg-slate-500/5"}`}
              >
                <span className="relative z-10">{job.company}</span>
                {/* Visual indicator for focus shift */}
                {isActive && (
                   <motion.div 
                     layoutId="indicator" 
                     className={`absolute inset-0 z-0 pointer-events-none ${isDarkMode ? "bg-accent-primary/10" : "bg-blue-100/50"}`}
                   />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHTSIDE: Job Detail Card */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeJob.company}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {isDarkMode ? (
                <BorderGlow
                  borderRadius={30}
                  glowColor="180 80 80"
                  backgroundColor="#13141a"
                  glowRadius={60}
                  glowIntensity={0.5}
                  edgeSensitivity={20}
                  className="h-full border border-slate-800/50"
                >
                  <JobContent job={activeJob} isDarkMode={isDarkMode} />
                </BorderGlow>
              ) : (
                <div className="relative h-full w-full rounded-[30px] overflow-visible">
                  <div className="absolute -inset-[3px] rounded-[33px] opacity-20 -z-10 blur-sm flex overflow-hidden">
                    <div className="w-full h-full bg-blue-100" />
                  </div>
                  <div className="h-full w-full rounded-[30px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12 relative">
                     <JobContent job={activeJob} isDarkMode={isDarkMode} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const JobContent = ({ job, isDarkMode }: { job: ExperienceItem, isDarkMode: boolean }) => (
  <div className={`space-y-6 relative z-10 h-full flex flex-col ${isDarkMode ? "p-8 md:p-12" : ""}`}>
    <div className="space-y-2">
      <h3 className={`text-2xl md:text-3xl font-display font-bold leading-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
        <span className="opacity-70">{job.jobTitle}</span>{" "}
        <span className={isDarkMode ? "text-accent-primary" : "text-blue-600"}>{job.company}</span>
      </h3>
      <p className={`font-mono text-sm tracking-widest font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
        {job.duration}
      </p>
    </div>

    <ul className="space-y-4">
      {job.desc.map((bullet, i) => (
        <motion.li 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-start gap-4 text-sm md:text-base leading-relaxed"
        >
          <span className={`shrink-0 mt-2 text-[10px] ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
            ●
          </span>
          <span className={isDarkMode ? "text-slate-400" : "text-slate-700"}>
            {bullet}
          </span>
        </motion.li>
      ))}
    </ul>
    
    {/* Decorative industrial elements */}
    <div className="mt-auto pt-8 flex items-center justify-between opacity-20 select-none">
      <div className={`text-[10px] font-mono tracking-[0.4em] uppercase ${isDarkMode ? "text-accent-primary" : "text-slate-400"}`}>
        EXP-LOG / {job.company.replace(/\s+/g, '-').toUpperCase()}
      </div>
      <div className={`h-[1px] flex-1 mx-8 ${isDarkMode ? "bg-accent-primary" : "bg-slate-300"}`} />
      <div className={`w-8 h-8 flex items-center justify-center border rounded-full ${isDarkMode ? "border-accent-primary" : "border-slate-300"}`}>
        <span className="text-[8px] font-bold">V{EXPERIENCE_DATA.indexOf(job) + 1}</span>
      </div>
    </div>
  </div>
);
