import { useMediaPlayback } from '../context/MediaPlaybackContext.jsx';

export default function WelcomeModal() {
  const { welcomeDismissed, dismissWelcome } = useMediaPlayback();

  if (welcomeDismissed) {
    return null;
  }

  return (
    <div className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-modal-title">
      <div className="welcome-modal__panel">
        <h2 id="welcome-modal-title" className="welcome-modal__title">
          Welcome to MiMo
        </h2>
        <button type="button" className="welcome-modal__button hover-light" onClick={dismissWelcome}>
          OK
        </button>
      </div>
    </div>
  );
}
