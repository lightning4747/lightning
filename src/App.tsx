import { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

  useLayoutEffect(() => {
    // Synchronously scroll to top before the browser paints — prevents
    // the browser's scroll restoration from jumping to Skills section on reload.
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col w-full relative">
      <Navbar />
      <SocialSidebar />
      <SectionNavigator />
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
