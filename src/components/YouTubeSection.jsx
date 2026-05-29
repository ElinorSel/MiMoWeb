import { useCallback, useEffect, useRef, useState } from 'react';

let apiLoadingPromise = null;

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

export default function YouTubeSection({ videoId, playerId, className = '', embedded = false }) {
  const containerId = playerId;
  const sectionRef = useRef(null);
  const playerRef = useRef(null);
  const hasStartedRef = useRef(false);
  const [showUnmute, setShowUnmute] = useState(false);
  const [ready, setReady] = useState(false);

  const startPlayback = useCallback(() => {
    if (hasStartedRef.current || !playerRef.current?.playVideo) return;
    hasStartedRef.current = true;
    playerRef.current.playVideo();
    setShowUnmute(true);
  }, []);

  useEffect(() => {
    let player = null;
    let cancelled = false;

    loadYouTubeIframeAPI().then(() => {
      if (cancelled) return;

      player = new window.YT.Player(containerId, {
        videoId,
        playerVars: {
          enablejsapi: 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            if (!cancelled) {
              playerRef.current = player;
              setReady(true);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      player?.destroy?.();
      playerRef.current = null;
    };
  }, [containerId, videoId]);

  useEffect(() => {
    if (!ready) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlayback();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [ready, startPlayback]);

  const handleUnmute = () => {
    playerRef.current?.unMute?.();
    setShowUnmute(false);
  };

  const Tag = embedded ? 'div' : 'section';

  return (
    <Tag ref={sectionRef} className={`youtube-section ${className}`.trim()}>
      <div className="youtube-section__wrapper">
        <div id={containerId} className="youtube-section__player" title="YouTube video player" />
        {showUnmute && (
          <button
            type="button"
            className="youtube-section__unmute hover-light"
            onClick={handleUnmute}
          >
            🔊 Unmute
          </button>
        )}
      </div>
    </Tag>
  );
}
