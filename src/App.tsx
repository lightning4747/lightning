import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/layout/Navbar';
import { ThemeToggle } from './components/ui/ThemeToggle';
import ClickSpark from './components/ui/ClickSpark';

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

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
            <div className="p-6 rounded-2xl bg-bg-tertiary border border-border shadow-theme">
              <h3 className="font-display text-2xl mb-2 text-accent-blue font-bold uppercase tracking-tight">Theme Context</h3>
              <p className="text-text-secondary">Connected successfully. Current theme: <span className="font-mono text-accent-primary uppercase font-bold tracking-widest">{theme}</span></p>
            </div>
            <div className="p-6 rounded-2xl bg-bg-tertiary border border-border shadow-theme">
              <h3 className="font-display text-2xl mb-2 text-accent-green font-bold uppercase tracking-tight">Token System</h3>
              <p className="text-text-secondary">Tailwind 3 + CSS variables working with characterful fonts.</p>
            </div>
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
