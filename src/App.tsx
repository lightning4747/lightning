import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { ThemeToggle } from './components/ui/ThemeToggle';
import ClickSpark from './components/ui/ClickSpark';
import BorderGlow from './components/ui/BorderGlow';

function App() {
  const { theme } = useTheme();

  return (
    <ClickSpark
      sparkColor="random"
      sparkSize={17}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="flex flex-col w-full">
        <Navbar />
        {/* Section Wrapper */}
        <section id="hero" className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-5xl md:text-9xl font-display mb-8">
            Lightning's Portfolio
          </h1>
          
          <p className="text-xl text-text-secondary max-w-md text-center mb-12 font-sans tracking-wide">
            A calm, breathing space for creative engineering and premium interfaces.
          </p>

          <div className="mb-12">
            <ThemeToggle />
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
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
                <p className="text-text-secondary leading-relaxed">Connected successfully. Current theme: <span className="font-mono text-accent-primary uppercase font-bold tracking-widest">{theme}</span></p>
              </div>
            </BorderGlow>

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
                <h3 className="font-display text-2xl mb-3 text-accent-green font-bold uppercase tracking-tight">Token System</h3>
                <p className="text-text-secondary leading-relaxed">Tailwind 3 + CSS variables working with characterful fonts.</p>
              </div>
            </BorderGlow>
          </div>
        </section>

        {/* Placeholder Sections for Scroll Test */}
        <section id="about" className="min-h-screen border-t border-border flex items-center justify-center">
          <h2 className="text-4xl font-display uppercase tracking-widest">About</h2>
        </section>
        <section id="skills" className="min-h-screen border-t border-border flex items-center justify-center">
          <h2 className="text-4xl font-display uppercase tracking-widest">Skills</h2>
        </section>
        <section id="experience" className="min-h-screen border-t border-border flex items-center justify-center">
          <h2 className="text-4xl font-display uppercase tracking-widest">Experience</h2>
        </section>
        <section id="projects" className="min-h-screen border-t border-border flex items-center justify-center">
          <h2 className="text-4xl font-display uppercase tracking-widest">Projects</h2>
        </section>
        <section id="contact" className="min-h-screen border-t border-border flex items-center justify-center">
          <h2 className="text-4xl font-display uppercase tracking-widest">Contact</h2>
        </section>
      </div>
    </ClickSpark>
  );
}

export default App;
