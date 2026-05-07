import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { FadeSection } from "../ui/FadeSection";
import BorderGlow from "../ui/BorderGlow";

const LIGHT_PALETTE = ['#E8645A', '#F5C842', '#5B9CF6', '#5DBE89'];

const MiniSocialCard = ({ icon, label, subtext, link, isDarkMode }: any) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isDarkMode) return;
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, [isDarkMode]);

  const conicGradient = `conic-gradient(from ${rotation}deg, ${LIGHT_PALETTE[0]}, ${LIGHT_PALETTE[1]}, ${LIGHT_PALETTE[2]}, ${LIGHT_PALETTE[3]}, ${LIGHT_PALETTE[0]})`;

  const cardInteriorContent = (
    <div className="flex items-center gap-4 p-4 relative z-10 h-full">
      <div className="w-10 h-10 shrink-0 flex items-center justify-center p-1 bg-white/5 rounded-lg overflow-hidden">
        <img src={icon} alt={label} className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col">
        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
          {label}
        </span>
        <span className={`text-sm font-bold truncate ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
          {subtext}
        </span>
      </div>
      <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
      </div>
    </div>
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full sm:w-[280px]"
    >
      {isDarkMode ? (
        <BorderGlow
          borderRadius={20}
          glowColor="180 80 80"
          backgroundColor="#191a1eff"
          glowRadius={30}
          glowIntensity={0.5}
          edgeSensitivity={20}
          className="h-full"
        >
          {cardInteriorContent}
        </BorderGlow>
      ) : (
        <div className="relative h-full w-full rounded-2xl overflow-visible">
          <div
            className="absolute -inset-[3px] rounded-[19px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
            style={{ background: conicGradient }}
          />
          <div className="h-full w-full rounded-2xl bg-white border border-slate-100 shadow-md shadow-slate-200/50 relative overflow-hidden">
            {cardInteriorContent}
          </div>
        </div>
      )}
    </a>
  );
};

export const About: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const techStack = [
    "Typescript", "Express", "Java", "PostgreSQL", "React.js", "Python"
  ];

  return (
    <section id="about" className="py-24 px-6 md:px-10 max-w-6xl mx-auto min-h-[80vh] flex flex-col justify-center overflow-visible">

      <FadeSection direction="down" delay={0.2} className="w-full text-left">
        <div className="section-header mb-4">
          <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
            / about me
          </span>
        </div>
      </FadeSection>

      {/* Main Core Section: Image + Text Row */}
      <div className="flex flex-col md:flex-row gap-12 items-start">



        {/* RIGHT SIDE: Text Content Only */}
        <div className="flex-1 space-y-6">
          <div className={`about-description space-y-4 p-2 transition-all duration-500 
            ${isDarkMode ? "text-slate-400" : "text-slate-700"}`}>
            <p className="text-lg leading-relaxed">
              I am a student at <b>MCET</b> pursuing my <b>B.Tech in Artificial Intelligence & Data Science</b>.
              Currently, I'm a <b>Software Engineer Intern</b> at
              <a href="https://eanstall.com" target="_blank" rel="noopener noreferrer"
                className={`mx-1 font-bold ${isDarkMode ? "text-accent-primary hover:text-white" : "text-blue-600 hover:text-blue-800"}`}>
                EANS Technologies
              </a>,
              where I architect scalable backend systems and optimize high-performance cloud infrastructure.
            </p>
            <p className="text-lg leading-relaxed">
              When I’m not building distributed systems, 
              I’m usually deep in <b>Machine Learning</b> research or studying <b>particle physics</b>. 
              Outside of code, I spend way too much time playing Souls games
            </p>
            <div className="pt-4">
              <p className={`mb-4 font-mono text-sm tracking-tight ${isDarkMode ? "text-accent-primary" : "text-blue-600"}`}>
                // Technologies I’ve been working with:
              </p>
              <ul className="grid grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                {techStack.map((tech, i) => {
                  const brandColor = LIGHT_PALETTE[i % LIGHT_PALETTE.length];
                  return (
                    <FadeSection key={`${theme}-${i}`} direction="up" delay={0.1 + (i * 0.05)}>
                      <motion.li
                        animate={{ color: isDarkMode ? '#94A3B8' : '#334155' }}
                        whileHover={{ x: 5, color: brandColor, transition: { duration: 0.2 } }}
                        className="flex items-center gap-2 text-sm font-mono font-bold cursor-default group"
                      >
                        <span className="shrink-0 group-hover:scale-125" style={{ color: brandColor }}>▹</span>
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

      {/* INDEPENDENT SOCIAL CARDS: Positioned under everything */}
      <FadeSection direction="up" delay={0.6} className="mt-16 flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        <MiniSocialCard
          id="github-stats-bottom"
          icon={import.meta.env.BASE_URL + "assets/github-142-svgrepo-com.svg"}
          label="GitHub"
          subtext="1000+ Contributions"
          link="https://github.com/lightning4747"
          isDarkMode={isDarkMode}
        />
        <MiniSocialCard
          id="leetcode-stats-bottom"
          icon={import.meta.env.BASE_URL + "assets/leetcode.svg"}
          label="LeetCode"
          subtext="300+ Solved"
          link="https://leetcode.com/u/lightning47/"
          isDarkMode={isDarkMode}
        />
      </FadeSection>

    </section>
  );
};
