import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaPlayback } from '../context/MediaPlaybackContext.jsx';

const SOUNDTRACK_SRC = '/audio/mimo-main-menu.mp3';

export default function SiteSoundtrack() {
  const { videoPlaying, cinematicEnded } = useMediaPlayback();
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const userPausedRef = useRef(false);
  const pausedForVideoRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const startSoundtrack = useCallback(async () => {
    const audio = audioRef.current;
    if (
      !audio
      || startedRef.current
      || userPausedRef.current
      || videoPlaying
      || !cinematicEnded
    ) {
      return;
    }

    try {
      await audio.play();
      startedRef.current = true;
      setPlaying(true);
    } catch {
      /* playback blocked */
    }
  }, [videoPlaying, cinematicEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  useEffect(() => {
    if (cinematicEnded) {
      startSoundtrack();
    }
  }, [cinematicEnded, startSoundtrack]);

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

    if (pausedForVideoRef.current && !userPausedRef.current && cinematicEnded) {
      audio.play().catch(() => {});
      pausedForVideoRef.current = false;
    }
  }, [videoPlaying, cinematicEnded]);

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
      } catch {
        /* playback blocked */
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
      >
        {playing ? '♫' : '♪'}
      </button>
    </>
  );
}
