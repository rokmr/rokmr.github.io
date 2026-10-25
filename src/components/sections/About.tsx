import { SectionHeader } from '../SectionHeader';
import { Education } from './Education';

/** Background follows the work: a personal path with supporting credentials. */
export function About() {
  return (
    <section id="about" aria-label="Background and education">
      <SectionHeader id="about" />
      <div className="background-story">
        <p>I started in electrical engineering, then chose AI research at <strong>IISc Bangalore</strong> after clearing GATE and BARC. My M.Tech work explored how models can learn new classes without retaining examples from earlier tasks.</p>
        <p>That research led to TACLE, published at WACV 2025. Since then, my work has expanded into diffusion-based image generation and agentic systems, while I continue to publish research in computer vision.</p>
      </div>
      <Education />
    </section>
  );
}
