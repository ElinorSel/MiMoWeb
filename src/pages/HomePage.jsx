import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import FadeInParagraph from '../components/FadeInParagraph.jsx';
import YouTubeSection from '../components/YouTubeSection.jsx';
import { CINEMATIC_YOUTUBE_ID, GAMEPLAY_YOUTUBE_ID } from '../config.js';
import {
  worldOfMiMoParagraphs,
  aboutMiMoParagraphs,
  learnMoreParagraphs,
  teamMembers,
  TEAM_EMAIL,
  socialLinks,
} from '../data/content.js';
import { formatBoldText } from '../utils/formatBoldText.jsx';

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  return (
    <>
      <Navbar />
      <div className="home-page surface-dark">
      <main>
        <Hero />

        <section className="section section--video" aria-label="Cinematic trailer">
          <YouTubeSection
            videoId={CINEMATIC_YOUTUBE_ID}
            playerId="youtube-cinematic"
          />
        </section>

        <section id="world" className="section section--text">
          <SectionHeading title="World of MiMo" />
          <div className="section__body">
            {worldOfMiMoParagraphs.map((text) => (
              <FadeInParagraph key={text}>{text}</FadeInParagraph>
            ))}
          </div>
        </section>

        <section id="about" className="section section--text">
          <SectionHeading title="About MiMo" />
          <div className="section__body">
            {aboutMiMoParagraphs.map((text) => (
              <FadeInParagraph key={text}>{text}</FadeInParagraph>
            ))}
          </div>
        </section>

        <section id="gameplay" className="section section--gameplay">
          <SectionHeading title="Gameplay" />
          <YouTubeSection
            videoId={GAMEPLAY_YOUTUBE_ID}
            playerId="youtube-gameplay"
            embedded
          />
          <h3 className="subsection-heading">Keybindings</h3>
          <img
            src="/images/keybindings.png"
            alt="Game controller keybindings diagram"
            className="keybindings-image"
          />
        </section>

        <section id="team" className="section section--team">
          <SectionHeading title="Meet The Team" />
          <img
            src="/images/team_photo.png"
            alt="MiMo development team group photo"
            className="team-photo"
          />
          <div className="team-grid">
            {teamMembers.map((member) => (
              <article key={member.email} className="team-card surface-light">
                <img
                  src={member.portrait}
                  alt={member.name}
                  className="team-card__portrait"
                />
                <h3 className="team-card__name">{member.name.toUpperCase()}</h3>
                <p className="team-card__role">{member.role}</p>
                <p className="team-card__links">
                  <a href={`mailto:${member.email}`}>{member.email}</a>
                  <br />
                  <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                    {member.linkedInLabel}
                  </a>
                </p>
                <ul className="team-card__bullets">
                  {member.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section section--text section--learn-more">
          <SectionHeading title="Learn More" />
          <div className="section__body">
            {learnMoreParagraphs.map((text) => (
              <FadeInParagraph key={text}>{formatBoldText(text)}</FadeInParagraph>
            ))}
            <FadeInParagraph>
              Contact us at:{' '}
              <a href={`mailto:${TEAM_EMAIL}`}>{TEAM_EMAIL}</a>
            </FadeInParagraph>
            <FadeInParagraph>
              Follow our journey on social media:{' '}
              {socialLinks.map((link, i) => (
                <span key={link.label}>
                  {i > 0 && ' · '}
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </span>
              ))}
            </FadeInParagraph>
            <p className="section__footer-links">
              <Link to="/devlog">Dev Log</Link>
              {' · '}
              <Link to="/gdd">GDD</Link>
            </p>
          </div>
        </section>
      </main>
      </div>
    </>
  );
}
