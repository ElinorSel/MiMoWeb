import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const MediaPlaybackContext = createContext(null);

export function MediaPlaybackProvider({ children }) {
  const playingVideosRef = useRef(new Set());
  const [videoPlaying, setVideoPlaying] = useState(false);

  const setVideoState = useCallback((playerId, isPlaying) => {
    if (isPlaying) {
      playingVideosRef.current.add(playerId);
    } else {
      playingVideosRef.current.delete(playerId);
    }
    setVideoPlaying(playingVideosRef.current.size > 0);
  }, []);

  const value = useMemo(
    () => ({ videoPlaying, setVideoState }),
    [videoPlaying, setVideoState],
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
