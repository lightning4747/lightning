import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ui/ThemeToggle';

function App() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl md:text-8xl font-display mb-8">
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
          <h3 className="font-display text-2xl mb-2 text-accent-blue">Theme Context</h3>
          <p className="text-text-secondary">Connected successfully. Current theme: <span className="font-mono text-accent-primary uppercase font-bold">{theme}</span></p>
        </div>
        <div className="p-6 rounded-2xl bg-bg-tertiary border border-border shadow-theme">
          <h3 className="font-display text-2xl mb-2 text-accent-green">Token System</h3>
          <p className="text-text-secondary">Tailwind 3 + CSS variables working with characterful fonts.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
