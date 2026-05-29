import { useEffect, useRef, useState } from 'react';
import {
  CINEMATIC_PLAYER_ID,
  useMediaPlayback,
} from '../context/MediaPlaybackContext.jsx';

let apiLoadingPromise = null;

const YT_ENDED = 0;
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

function isVideoActive(state) {
  return state === YT_PLAYING || state === YT_BUFFERING;
}

function shouldShowPlayOverlay(state, playerReady, autoPlayOnScroll) {
  if (!playerReady || autoPlayOnScroll) return false;
  return state !== YT_PLAYING && state !== YT_BUFFERING;
}

export default function YouTubeSection({
  videoId,
  playerId,
  className = '',
  embedded = false,
  autoPlayOnScroll = false,
}) {
  const { setVideoState, markCinematicEnded } = useMediaPlayback();
  const sectionRef = useRef(null);
  const playerRef = useRef(null);
  const hasAutoPlayedRef = useRef(false);
  const autoplayDelayRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [playerState, setPlayerState] = useState(-1);
  const isActivelyPlaying = isVideoActive(playerState);
  const showPlayOverlay = shouldShowPlayOverlay(
    playerState,
    playerReady,
    autoPlayOnScroll,
  );
  const showClickLayer = playerReady && !showPlayOverlay;
  const isCinematic = playerId === CINEMATIC_PLAYER_ID;

  const startPlayback = () => {
    const player = playerRef.current;
    if (!player) return;
    player.unMute?.();
    player.playVideo?.();
  };

  const handleOverlayPlay = () => {
    startPlayback();
  };

  const handleVideoClick = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isActivelyPlaying) {
      player.pauseVideo?.();
    } else {
      startPlayback();
    }
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
            setPlayerState(state);
            setVideoState(playerId, isVideoActive(state));
            if (isCinematic && state === YT_ENDED) {
              markCinematicEnded();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      setVideoState(playerId, false);
      setPlayerReady(false);
      setPlayerState(-1);
      player?.destroy?.();
      playerRef.current = null;
    };
  }, [playerId, videoId, setVideoState, isCinematic, markCinematicEnded]);

  useEffect(() => {
    if (!autoPlayOnScroll || !playerReady) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    let observer = null;

    const cancelAutoplay = () => {
      if (autoplayDelayRef.current) {
        clearTimeout(autoplayDelayRef.current);
        autoplayDelayRef.current = null;
      }
    };

    const scheduleAutoplay = () => {
      if (hasAutoPlayedRef.current || autoplayDelayRef.current) return;

      autoplayDelayRef.current = setTimeout(() => {
        autoplayDelayRef.current = null;
        const player = playerRef.current;
        if (!player || hasAutoPlayedRef.current) return;

        player.unMute?.();
        player.playVideo?.();
        hasAutoPlayedRef.current = true;
        observer?.disconnect();
      }, 1000);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          scheduleAutoplay();
        } else {
          cancelAutoplay();
        }
      },
      {
        threshold: 0.45,
        rootMargin: '0px 0px -30% 0px',
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      cancelAutoplay();
    };
  }, [autoPlayOnScroll, playerReady]);

  const Tag = embedded ? 'div' : 'section';

  return (
    <Tag ref={sectionRef} className={`youtube-section ${className}`.trim()}>
      <div
        className={`youtube-section__wrapper youtube-section__wrapper--chromeless${
          isActivelyPlaying ? ' youtube-section__wrapper--playing' : ''
        }`}
      >
        <div id={playerId} className="youtube-section__player" title="YouTube video player" />
        {showClickLayer && (
          <button
            type="button"
            className="youtube-section__click-layer"
            onClick={handleVideoClick}
            aria-label={isActivelyPlaying ? 'Pause video' : 'Play video'}
          />
        )}
        {showPlayOverlay && (
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
