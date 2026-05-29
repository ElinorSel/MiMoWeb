import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
        <Link to="/play" className="hero__play">
          ▶ Play MiMo
        </Link>
        <p className="hero__tagline">
          MiMo, a Co-Op puzzle and boss-fighting game set in two linked worlds.
        </p>
      </div>
    </section>
  );
}
