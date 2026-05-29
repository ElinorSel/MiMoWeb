import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page surface-dark">
      <Navbar />
      <main className="placeholder-page__main">
        <h1>{title}</h1>
        <p>Coming soon.</p>
        <p>
          <Link to="/home" className="placeholder-page__link">
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
