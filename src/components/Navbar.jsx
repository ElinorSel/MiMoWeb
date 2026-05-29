import { Link, useLocation } from 'react-router-dom';

const anchorLinks = [
  { label: 'World of MiMo', hash: '#world' },
  { label: 'About', hash: '#about' },
  { label: 'Gameplay', hash: '#gameplay' },
  { label: 'Contact', hash: '#contact' },
];

export default function Navbar() {
  const location = useLocation();
  const onHome = location.pathname === '/home';

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchor = (hash) => (e) => {
    if (!onHome) return;
    e.preventDefault();
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const anchorHref = (hash) => (onHome ? hash : `/home${hash}`);

  return (
    <nav className="navbar surface-dark" aria-label="Main navigation">
      <a
        href="/home"
        className="navbar__brand"
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        <img src="/images/mi_icon.gif" alt="" className="navbar__icon" />
        <span>MiMo</span>
      </a>
      <ul className="navbar__links">
        {anchorLinks.map(({ label, hash }) => (
          <li key={hash}>
            <a
              href={anchorHref(hash)}
              onClick={onHome ? handleAnchor(hash) : undefined}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <Link to="/devlog">Dev Log</Link>
        </li>
        <li>
          <Link to="/gdd">GDD</Link>
        </li>
      </ul>
    </nav>
  );
}
