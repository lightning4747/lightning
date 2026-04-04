import { useLayoutEffect, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import ClickSpark from './components/ui/ClickSpark';
import { Hero } from './components/sections/Hero';
import { GamesPage } from './pages/GamesPage';
import { BooksPage } from './pages/BooksPage';

import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { SocialSidebar } from './components/ui/SocialSidebar';
import { SectionNavigator } from './components/ui/SectionNavigator';

// Disable browser scroll restoration at module level, before any React render.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function MainPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    // Scroll to top on direct reload ONLY if no specific scroll section is requested
    if (!location.state?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [location.state?.scrollTo]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      // Small timeout to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          // Clear history state so refresh doesn't trigger scroll again
          navigate(location.pathname, { replace: true, state: {} });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <div className="flex flex-col w-full relative">
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <ClickSpark sparkColor="random" sparkSize={17} sparkRadius={15} sparkCount={8} duration={400}>
        <div className="flex flex-col w-full relative">
          <Navbar />
          <SocialSidebar />
          <SectionNavigator />
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/books" element={<BooksPage />} />
          </Routes>
        </div>
      </ClickSpark>
    </HashRouter>
  );
}

export default App;
