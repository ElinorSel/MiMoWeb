import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaPlayback } from '../context/MediaPlaybackContext.jsx';

const SOUNDTRACK_SRC = '/audio/mimo-main-menu.mp3';

export default function SiteSoundtrack() {
  const { videoPlaying } = useMediaPlayback();
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const userPausedRef = useRef(false);
  const pausedForVideoRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const startSoundtrack = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || startedRef.current || userPausedRef.current || videoPlaying) return;

    try {
      await audio.play();
      startedRef.current = true;
      setPlaying(true);
      setNeedsInteraction(false);
    } catch {
      setNeedsInteraction(true);
    }
  }, [videoPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    startSoundtrack();

    const resumeOnInteraction = () => {
      startSoundtrack();
    };

    document.addEventListener('click', resumeOnInteraction);
    document.addEventListener('keydown', resumeOnInteraction);
    document.addEventListener('touchstart', resumeOnInteraction);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      document.removeEventListener('click', resumeOnInteraction);
      document.removeEventListener('keydown', resumeOnInteraction);
      document.removeEventListener('touchstart', resumeOnInteraction);
    };
  }, [startSoundtrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (videoPlaying) {
      if (!audio.paused) {
        audio.pause();
        pausedForVideoRef.current = true;
      }
      return;
    }

    if (pausedForVideoRef.current && !userPausedRef.current) {
      audio.play().catch(() => {});
      pausedForVideoRef.current = false;
    }
  }, [videoPlaying]);

  const toggleSoundtrack = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (videoPlaying) {
        userPausedRef.current = true;
        pausedForVideoRef.current = false;
        return;
      }
      try {
        await audio.play();
        startedRef.current = true;
        userPausedRef.current = false;
        pausedForVideoRef.current = false;
        setPlaying(true);
        setNeedsInteraction(false);
      } catch {
        setNeedsInteraction(true);
      }
    } else {
      audio.pause();
      userPausedRef.current = true;
      pausedForVideoRef.current = false;
    }
  };

  return (
    <>
      <audio ref={audioRef} src={SOUNDTRACK_SRC} loop preload="auto" />
      <button
        type="button"
        className="soundtrack-toggle hover-dark"
        onClick={toggleSoundtrack}
        aria-label={playing ? 'Pause soundtrack' : 'Play soundtrack'}
        title={needsInteraction && !playing ? 'Click to start soundtrack' : undefined}
      >
        {playing ? '♫' : '♪'}
      </button>
    </>
  );
}
