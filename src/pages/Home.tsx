import { Header } from '../components/Header';
import { HeroCanvas } from '../components/HeroCanvas';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { NoscriptProfile } from '../components/NoscriptProfile';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Experience } from '../components/sections/Experience';
import { Projects } from '../components/sections/Projects';
import { Publications } from '../components/sections/Publications';
import { Skills } from '../components/sections/Skills';
import { Education } from '../components/sections/Education';
import { Service } from '../components/sections/Service';
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
        <Projects />
        <Publications />
        <Skills />
        <Education />
        <Service />
        <Contact />
      </main>

      <Footer buildYear={buildYear} />
      <BackToTop />
    </>
  );
}
