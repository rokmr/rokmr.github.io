import { SectionHeader } from '../SectionHeader';

export function About() {
  return (
    <section id="about" aria-label="About Rohit Kumar">
      <SectionHeader id="about" />
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
          {/*
            This section deliberately does not recap employers, papers or
            reviewing: Experience (02) and Research (03) follow immediately and
            cover all three in full. What belongs here is the part nothing else
            on the page can say — how an electrical engineer ended up in AI.
          */}
          <p>
            My path to AI started in electrical engineering - clearing{' '}
            <strong>GATE (AIR 221 EE, AIR 227 IN)</strong> and <strong>BARC</strong>, then choosing
            research over a government job. That decision led me to <strong>IISc</strong>, and to my
            first paper on continual learning.
          </p>
          <p>
            The boundary between what machines see and what they understand keeps blurring - I build
            at that edge.
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
