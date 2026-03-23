import { useTheme } from './hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl md:text-7xl font-display mb-8">
        Lightning's Portfolio
      </h1>
      
      <p className="text-xl text-text-secondary max-w-md text-center mb-12 font-sans">
        A calm, breathing space that feels like a late-night terminal meets premium SaaS.
      </p>

      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-bg-secondary border border-border shadow-theme hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {theme === 'light' ? (
          <>
            <Moon className="w-5 h-5 text-accent-primary" />
            <span>Switch to Dark</span>
          </>
        ) : (
          <>
            <Sun className="w-5 h-5 text-accent-yellow" />
            <span>Switch to Light</span>
          </>
        )}
      </button>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
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
