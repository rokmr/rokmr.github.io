import { SectionHeader } from '../SectionHeader';

export function About() {
  return (
    <section id="about" aria-label="About Rohit Kumar">
      <SectionHeader number="01" title="About" />
      <div className="about-grid">
        <div className="profile-photo">
          <picture>
            <source srcSet="assets/images/profile.webp" type="image/webp" />
            <img
              src="assets/images/profile.png"
              alt="Rohit Kumar - AI Engineer, IISc Bangalore M.Tech alumnus"
              width={440}
              height={440}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <div className="about-text">
          <h2>From Signals to Neural Networks</h2>
          <p>
            My path to AI started in electrical engineering - clearing{' '}
            <strong>GATE (AIR 221 EE, AIR 227 IN)</strong> and <strong>BARC</strong>, then choosing
            research over a government job. That decision led me to <strong>IISc</strong>, where I
            published on continual learning (<strong>WACV 2025</strong>) and discovered my calling:
            building systems where vision and language work together.
          </p>
          <p>
            Since then I've shipped production systems at <strong>Avataar AI</strong> and{' '}
            <strong>Armada AI</strong>, published at <strong>CVPR 2026 Workshop</strong> on
            diffusion-based visual storytelling (<strong>AttriStory</strong>), and review research
            for <strong>NeurIPS, CVPR &amp; ECCV 2026</strong>. The boundary between what machines
            see and what they understand keeps blurring - I build at that edge.
          </p>
          <p className="about-currently">
            Currently reading: <strong>Reinforcement Learning</strong> — exploring how agents learn
            to act optimally through interaction.
          </p>
        </div>
      </div>
    </section>
  );
}
