import { useEffect, useRef, useState } from 'react';

let apiLoadingPromise = null;

const YT_PLAYING = 1;
const YT_BUFFERING = 3;

const CHROMELESS_PLAYER_VARS = {
  enablejsapi: 1,
  playsinline: 1,
  controls: 0,
  modestbranding: 1,
  rel: 0,
  fs: 0,
  iv_load_policy: 3,
  disablekb: 1,
  cc_load_policy: 0,
  origin: typeof window !== 'undefined' ? window.location.origin : undefined,
};

function loadYouTubeIframeAPI() {
  if (window.YT?.Player) {
    return Promise.resolve();
  }
  if (apiLoadingPromise) {
    return apiLoadingPromise;
  }

  apiLoadingPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.appendChild(script);
  });

  return apiLoadingPromise;
}

export default function YouTubeSection({
  videoId,
  playerId,
  className = '',
  embedded = false,
}) {
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isActivelyPlaying, setIsActivelyPlaying] = useState(false);

  const handleOverlayPlay = () => {
    const player = playerRef.current;
    if (!player) return;
    player.unMute?.();
    player.playVideo?.();
  };

  useEffect(() => {
    let player = null;
    let cancelled = false;

    loadYouTubeIframeAPI().then(() => {
      if (cancelled) return;

      player = new window.YT.Player(playerId, {
        videoId,
        playerVars: CHROMELESS_PLAYER_VARS,
        events: {
          onReady: () => {
            if (!cancelled) {
              playerRef.current = player;
              setPlayerReady(true);
            }
          },
          onStateChange: (event) => {
            if (cancelled) return;
            const state = event.data;
            setIsActivelyPlaying(state === YT_PLAYING || state === YT_BUFFERING);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      setPlayerReady(false);
      setIsActivelyPlaying(false);
      player?.destroy?.();
      playerRef.current = null;
    };
  }, [playerId, videoId]);

  const Tag = embedded ? 'div' : 'section';

  return (
    <Tag className={`youtube-section ${className}`.trim()}>
      <div className="youtube-section__wrapper youtube-section__wrapper--chromeless">
        <div id={playerId} className="youtube-section__player" title="YouTube video player" />
        {playerReady && !isActivelyPlaying && (
          <button
            type="button"
            className="youtube-section__play-overlay"
            onClick={handleOverlayPlay}
            aria-label="Play video"
          >
            <span className="youtube-section__play-icon" aria-hidden="true" />
          </button>
        )}
      </div>
    </Tag>
  );
}
