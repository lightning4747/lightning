import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { FadeSection } from '../ui/FadeSection';
import { DataTerrain } from '../ui/DataTerrain';
import { ParallaxField } from '../ui/ParallaxField';
import { BlueprintGrid } from '../ui/BlueprintGrid';
import { ParticlePortrait } from '../ui/ParticlePortrait';
import { FractalTree } from '../ui/FractalTree';
import { useTheme } from '../../hooks/useTheme';

/**
 * Typewriter effect for high-fidelity intro
 */
const Typewriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const characters = Array.from(text);
  
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const Hero = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-primary pt-12 md:pt-20">
      {/* Background Layers */}
      <BlueprintGrid />
      <DataTerrain />
      <ParallaxField />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 z-10 w-full text-center flex flex-col items-center relative">
        <div className="flex flex-col items-center">
          
          {/* Tagline */}
          <FadeSection direction="down" delay={0.2}>
            <h2 className="font-mono text-accent-primary tracking-[0.4em] uppercase text-[10px] font-bold bg-accent-primary/5 px-4 py-1.5 rounded-full border border-accent-primary/20 backdrop-blur-sm shadow-sm mb-8">
              Aspiring Full Stack Software Engineer
            </h2>
          </FadeSection>
          
          {/* Portrait Container - Switches by Theme */}
          <FadeSection direction="none" delay={0.5} distance={10}>
            <div className="relative py-8 mb-4 scale-95 md:scale-100">
               {isDarkMode ? <ParticlePortrait /> : <FractalTree />}
               
               {/* Premium Frame Corners */}
               <div className={`absolute top-0 left-0 w-8 h-8 border-l border-t ${isDarkMode ? "border-accent-primary" : "border-blue-500"} opacity-30 pointer-events-none`} />
               <div className={`absolute top-0 right-0 w-8 h-8 border-r border-t ${isDarkMode ? "border-accent-primary" : "border-blue-500"} opacity-30 pointer-events-none`} />
               <div className={`absolute bottom-0 left-0 w-8 h-8 border-l border-b ${isDarkMode ? "border-accent-primary" : "border-blue-500"} opacity-30 pointer-events-none`} />
               <div className={`absolute bottom-0 right-0 w-8 h-8 border-r border-b ${isDarkMode ? "border-accent-primary" : "border-blue-500"} opacity-30 pointer-events-none`} />
            </div>
          </FadeSection>

          {/* Intro Information - Matching Provided Snippet Structure */}
          <div className="intro-block space-y-6 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight">
              <span className={isDarkMode ? "text-slate-100" : "text-slate-900"}>
                <Typewriter text="Hello..." delay={1.2} />
                <span className={isDarkMode ? "text-accent-primary" : "text-blue-600"}>
                  {/* <Typewriter text="vicky" delay={1.6} /> */}
                </span>
                {/* <Typewriter text=" here." delay={2.1} /> */}
              </span>
            </h1>

            <FadeSection delay={1.4} direction="up" distance={20}>
              <p className={`text-lg md:text-xl font-sans leading-relaxed transition-colors duration-500 
                ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                I'm an <b>Aspiring Full Stack Software Engineer</b> fascinated by high-performance systems and 
                large-scale architectures. I specialize in building robust backend services and 
                immersive digital experiences that merge engineering with art.
              </p>
            </FadeSection>

            <FadeSection delay={2.0} direction="up" distance={20}>
              <div className="flex justify-center pt-4">
                <a 
                  href="mailto:contact@vignesh112847@gmail.com" 
                  className={`group relative flex items-center gap-3 px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase transition-all duration-300
                    ${isDarkMode 
                      ? "bg-accent-primary/10 border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20" 
                      : "bg-blue-600 border border-blue-700 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                    }`}
                >
                  <Mail size={18} className="group-hover:scale-110 transition-transform" />
                  Say hi!
                  {/* Decorative underline animation */}
                  <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] ${isDarkMode ? "bg-accent-primary" : "bg-white"} transition-all duration-300 group-hover:w-2/3`} />
                </a>
              </div>
            </FadeSection>
          </div>
        </div>
      </div>
      
      {/* Visual Depth Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-primary)_85%)] pointer-events-none -z-1" />
    </section>
  );
};
