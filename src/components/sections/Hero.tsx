import { FadeSection } from '../ui/FadeSection';
import { DataTerrain } from '../ui/DataTerrain';
import { ParallaxField } from '../ui/ParallaxField';
import { BlueprintGrid } from '../ui/BlueprintGrid';
import { ParticlePortrait } from '../ui/ParticlePortrait';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-primary pt-12 md:pt-20">
      {/* Background Layers */}
      <BlueprintGrid />
      <DataTerrain />
      
      {/* 3D Floating Field - High Z-index for interactivity */}
      <ParallaxField />

      {/* Centered Content Layer - Static */}
      <div className="max-w-4xl mx-auto px-6 z-10 w-full text-center flex flex-col items-center relative">
        <div className="flex flex-col items-center">
          <FadeSection direction="down" delay={0.2}>
            <h2 className="font-mono text-accent-primary tracking-[0.5em] uppercase text-xs font-bold bg-accent-primary/5 px-4 py-1.5 rounded-full border border-accent-primary/20 backdrop-blur-sm shadow-sm mb-4">
              Full stack + ML Engineer
            </h2>
          </FadeSection>
          
          <FadeSection direction="none" delay={0.5} distance={10}>
            <div className="relative cursor-none py-10 scale-90 md:scale-100">
               <ParticlePortrait />
               
               {/* Decorative frame elements to make it feel premium */}
               <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-accent-primary opacity-20 pointer-events-none" />
               <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-accent-primary opacity-20 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-accent-primary opacity-20 pointer-events-none" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-accent-primary opacity-20 pointer-events-none" />
            </div>
          </FadeSection>

          <FadeSection delay={0.8} direction="up" distance={40}>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-accent-primary text-black font-bold uppercase tracking-[0.2em] text-xs rounded-full shadow-[0_0_30px_rgba(78,205,196,0.3)] transition-shadow"
              >
                View My Work
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: 'var(--accent-primary)', color: 'black' }}
                className="px-10 py-5 border border-border text-text-primary uppercase tracking-[0.2em] text-xs rounded-full font-bold transition-all"
              >
                Let's Connect
              </motion.button>
            </div>
          </FadeSection>
        </div>
      </div>
      
      {/* Visual Depth Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-primary)_80%)] pointer-events-none -z-1" />
    </section>
  );
};
