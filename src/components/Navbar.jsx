import { Link, useLocation, useNavigate } from 'react-router-dom';
import miIcon from '../assets/mi_icon.gif';

const anchorLinks = [
  { label: 'World of MiMo', hash: '#world' },
  { label: 'About', hash: '#about' },
  { label: 'Gameplay', hash: '#gameplay' },
  { label: 'Contact', hash: '#contact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === '/home';

  const handleBrandClick = (e) => {
    if (onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    e.preventDefault();
    navigate('/home');
  };

  const handleAnchor = (hash) => (e) => {
    if (!onHome) return;
    e.preventDefault();
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const anchorHref = (hash) => (onHome ? hash : `/home${hash}`);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar__brand-wrap">
        <a
          href="/home"
          className="navbar__brand"
          onClick={handleBrandClick}
        >
          <img
            src={miIcon}
            alt=""
            className="navbar__icon"
            width="36"
            height="36"
            decoding="async"
          />
          <span className="navbar__title">MiMo</span>
        </a>
      </div>
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
