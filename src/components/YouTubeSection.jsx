import { useEffect, useRef } from 'react';
import { useMediaPlayback } from '../context/MediaPlaybackContext.jsx';

let apiLoadingPromise = null;

const YT_PLAYING = 1;
const YT_PAUSED = 2;
const YT_BUFFERING = 3;

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

function isVideoActive(state) {
  return state === YT_PLAYING || state === YT_BUFFERING;
}

export default function YouTubeSection({ videoId, playerId, className = '', embedded = false }) {
  const { setVideoState } = useMediaPlayback();
  const playerRef = useRef(null);

  useEffect(() => {
    let player = null;
    let cancelled = false;

    loadYouTubeIframeAPI().then(() => {
      if (cancelled) return;

      player = new window.YT.Player(playerId, {
        videoId,
        playerVars: {
          enablejsapi: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            if (!cancelled) {
              playerRef.current = player;
            }
          },
          onStateChange: (event) => {
            if (cancelled) return;
            setVideoState(playerId, isVideoActive(event.data));
          },
        },
      });
    });

    return () => {
      cancelled = true;
      setVideoState(playerId, false);
      player?.destroy?.();
      playerRef.current = null;
    };
  }, [playerId, videoId, setVideoState]);

  const Tag = embedded ? 'div' : 'section';

  return (
    <Tag className={`youtube-section ${className}`.trim()}>
      <div className="youtube-section__wrapper">
        <div id={playerId} className="youtube-section__player" title="YouTube video player" />
      </div>
    </Tag>
  );
}
