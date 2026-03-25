import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import ClickSpark from './components/ui/ClickSpark';
import { Hero } from './components/sections/Hero';
import BorderGlow from './components/ui/BorderGlow';
import { FadeSection } from './components/ui/FadeSection';
import { GamesPage } from './pages/GamesPage';
import { BooksPage } from './pages/BooksPage';

function MainPage() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col w-full relative">
      <Navbar />
      <Hero />

      {/* Decorative Divider with BorderGlow context cards */}
      <div className="mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-6">
        <FadeSection direction="up" delay={0.2}>
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor='#1A1A1A'
            borderRadius={28}
            glowRadius={30}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-8 h-full bg-bg-secondary/50 backdrop-blur-sm rounded-[23px]">
              <h3 className="font-display text-2xl mb-3 text-accent-blue font-bold uppercase tracking-tight">Theme Context</h3>
              <p className="text-text-secondary leading-relaxed uppercase font-mono tracking-widest text-xs">Connected successfully. Current theme: <span className="font-mono text-accent-primary uppercase font-bold">{theme}</span></p>
            </div>
          </BorderGlow>
        </FadeSection>

        <FadeSection delay={0.4} direction="up">
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor='#1A1A1A'
            borderRadius={28}
            glowRadius={30}
            glowIntensity={1}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-8 h-full bg-bg-secondary/50 backdrop-blur-sm rounded-[23px]">
              <h3 className="font-display text-2xl mb-3 text-accent-green font-bold uppercase tracking-tight">Particle Tech</h3>
              <p className="text-text-secondary leading-relaxed uppercase font-mono tracking-widest text-xs">React Three Fiber + Shaders powering the visual experience.</p>
            </div>
          </BorderGlow>
        </FadeSection>
      </div>

      <section id="about" className="min-h-screen border-t border-border flex items-center justify-center bg-bg-primary">
        <FadeSection><h2 className="text-4xl font-display uppercase tracking-widest">About</h2></FadeSection>
      </section>
      <section id="skills" className="min-h-screen border-t border-border flex items-center justify-center">
        <FadeSection direction="left"><h2 className="text-4xl font-display uppercase tracking-widest">Skills</h2></FadeSection>
      </section>
      <section id="experience" className="min-h-screen border-t border-border flex items-center justify-center">
        <FadeSection direction="right"><h2 className="text-4xl font-display uppercase tracking-widest">Experience</h2></FadeSection>
      </section>
      <section id="projects" className="min-h-screen border-t border-border flex items-center justify-center">
        <FadeSection direction="none"><h2 className="text-4xl font-display uppercase tracking-widest">Projects</h2></FadeSection>
      </section>
      <section id="contact" className="min-h-screen border-t border-border flex items-center justify-center">
        <FadeSection direction="up" distance={100}><h2 className="text-4xl font-display uppercase tracking-widest">Contact</h2></FadeSection>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClickSpark sparkColor="random" sparkSize={17} sparkRadius={15} sparkCount={8} duration={400}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/books" element={<BooksPage />} />
        </Routes>
      </ClickSpark>
    </BrowserRouter>
  );
}

export default App;

