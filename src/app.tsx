import { About } from './components/about';
import { Experience } from './components/experience';
import { Footer } from './components/footer';
import { Hero } from './components/hero';
import { Nav } from './components/nav';
import { Projects } from './components/projects';
import { Skills } from './components/skills';
import { useTheme } from './hooks/use-theme';

export function App() {
  const { theme, toggle } = useTheme();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <About />
      </main>
      <Footer />
    </>
  );
}
