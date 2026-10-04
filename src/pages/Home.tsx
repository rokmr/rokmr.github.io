import { Header } from '../components/Header';
import { HeroCanvas } from '../components/HeroCanvas';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { NoscriptProfile } from '../components/NoscriptProfile';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Experience } from '../components/sections/Experience';
import { Research } from '../components/sections/Research';
import { Projects } from '../components/sections/Projects';
import { Skills } from '../components/sections/Skills';
import { Education } from '../components/sections/Education';
import { Contact } from '../components/sections/Contact';
import { useMobileNav } from '../hooks/useMobileNav';
import { useSectionReveal } from '../hooks/useSectionReveal';

export function Home({ buildYear }: { buildYear: number }) {
  const nav = useMobileNav();
  useSectionReveal();

  return (
    <>
      <a href="#about" className="skip-to-content">
        Skip to content
      </a>

      <NoscriptProfile />
      <HeroCanvas />

      <main className="content">
        <Header nav={nav} />
        <Hero onNavClick={nav.onNavClick} />
        <About />
        <Experience />
        <Research />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer buildYear={buildYear} />
      <BackToTop />
    </>
  );
}
