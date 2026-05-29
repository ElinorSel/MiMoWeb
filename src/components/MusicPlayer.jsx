import { useEffect, useRef, useState } from 'react';
import { subscribeGameplayVideoState } from '../lib/gameplayYoutubeBridge.js';

const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

const SONGS = [
  { label: 'Main Menu', src: '/music/mimo-main-menu.mp3' },
  { label: 'Boss Fight', src: '/music/boss-fight.mp3' },
  { label: 'Dark Music', src: '/music/dark-music.mp3' },
  { label: 'Before Ritual', src: '/music/mimo-cinematic-before-ritual.mp3' },
];

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);
  const pausedByVideoRef = useRef(false);
  const skipSongAutoplayRef = useRef(true);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausedByVideo, setPausedByVideo] = useState(false);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    pausedByVideoRef.current = pausedByVideo;
  }, [pausedByVideo]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = SONGS[currentSong].src;
    audio.load();

    if (skipSongAutoplayRef.current) {
      skipSongAutoplayRef.current = false;
      return;
    }

    setIsPlaying(true);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
      return;
    }

    audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    return subscribeGameplayVideoState((state) => {
      if (state === YT_PLAYING) {
        if (isPlayingRef.current) {
          setPausedByVideo(true);
          setIsPlaying(false);
        }
        return;
      }

      if (state === YT_PAUSED || state === YT_ENDED) {
        if (pausedByVideoRef.current) {
          setPausedByVideo(false);
          setIsPlaying(true);
        }
      }
    });
  }, []);

  const handleTriggerClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    setIsExpanded(true);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const handlePlaybackToggle = () => {
    setPausedByVideo(false);
    setIsPlaying((playing) => !playing);
  };

  const handleSelectSong = (index) => {
    if (index === currentSong) return;
    setPausedByVideo(false);
    setCurrentSong(index);
  };

  return (
    <div className={`music-player${isExpanded ? ' music-player--expanded' : ''}`}>
      <button
        type="button"
        className="music-player__trigger"
        onClick={handleTriggerClick}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Close music menu' : 'Open music menu'}
      >
        {isPlaying ? '⏸' : '♪'}
      </button>
      <div
        className={`music-player__menu${isExpanded ? ' music-player__menu--visible' : ''}`}
        aria-hidden={!isExpanded}
      >
        <button
          type="button"
          className="music-player__playback"
          onClick={handlePlaybackToggle}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <ul className="music-player__tracks" role="listbox" aria-label="Tracks">
          {SONGS.map((song, index) => (
            <li key={song.src} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === currentSong}
                className={`music-player__track${
                  index === currentSong ? ' music-player__track--active' : ''
                }`}
                onClick={() => handleSelectSong(index)}
              >
                {song.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <audio ref={audioRef} loop preload="auto" />
    </div>
  );
}
