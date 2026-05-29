import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export const CINEMATIC_PLAYER_ID = 'youtube-cinematic';

const MediaPlaybackContext = createContext(null);

export function MediaPlaybackProvider({ children }) {
  const playingVideosRef = useRef(new Set());
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [cinematicEnded, setCinematicEnded] = useState(false);

  const setVideoState = useCallback((playerId, isPlaying) => {
    if (isPlaying) {
      playingVideosRef.current.add(playerId);
    } else {
      playingVideosRef.current.delete(playerId);
    }
    setVideoPlaying(playingVideosRef.current.size > 0);
  }, []);

  const dismissWelcome = useCallback(() => {
    setWelcomeDismissed(true);
  }, []);

  const markCinematicEnded = useCallback(() => {
    setCinematicEnded(true);
  }, []);

  const value = useMemo(
    () => ({
      videoPlaying,
      welcomeDismissed,
      cinematicEnded,
      setVideoState,
      dismissWelcome,
      markCinematicEnded,
    }),
    [
      videoPlaying,
      welcomeDismissed,
      cinematicEnded,
      setVideoState,
      dismissWelcome,
      markCinematicEnded,
    ],
  );

  return (
    <MediaPlaybackContext.Provider value={value}>
      {children}
    </MediaPlaybackContext.Provider>
  );
}

export function useMediaPlayback() {
  const context = useContext(MediaPlaybackContext);
  if (!context) {
    throw new Error('useMediaPlayback must be used within MediaPlaybackProvider');
  }
  return context;
}
