import { useEffect, useState } from 'react';
import { UNITY_BUILD_URL } from '../config.js';

export default function Hero() {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f === 1 ? 2 : 1));
    }, 500);
    return () => clearInterval(id);
  }, []);

  const bgUrl =
    frame === 1 ? '/images/hero_bg_frame1.png' : '/images/hero_bg_frame2.png';

  return (
    <section id="top" className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${bgUrl})` }}
        aria-hidden="true"
      />
      <div className="hero__gradient" aria-hidden="true" />
      <div className="hero__content">
        <a
          href={UNITY_BUILD_URL}
          className="hero__play"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/mi_icon.gif"
            alt=""
            className="hero__play__icon"
            aria-hidden="true"
          />
          <span className="hero__play__text">Play</span>
          <img
            src="/images/mo_icon.gif"
            alt=""
            className="hero__play__icon"
            aria-hidden="true"
          />
        </a>
        <p className="hero__tagline">
          MiMo, a Co-Op puzzle and boss-fighting game set in two linked worlds.
        </p>
      </div>
    </section>
  );
}
