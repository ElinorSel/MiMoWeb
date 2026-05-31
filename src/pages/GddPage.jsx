import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { GDD_EMBED_URL } from '../config.js';

export default function GddPage() {
  return (
    <>
      <Navbar />
      <div className="gdd-page surface-dark">
        <main className="gdd-page__main">
          <div className="gdd-page__header">
            <h1 className="gdd-page__title">GDD</h1>
            <Link to="/home" className="gdd-page__back hover-dark">
              Back to home
            </Link>
          </div>
          <iframe
            className="gdd-page__embed"
            src={GDD_EMBED_URL}
            title="MiMo Game Design Document"
            allowFullScreen
          />
        </main>
      </div>
    </>
  );
}
