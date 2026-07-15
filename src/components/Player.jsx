import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward, faPlay, faPause, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/PlayerContext';

let apiLoadPromise = null;
const loadYouTubeAPI = () => {
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;
  apiLoadPromise = new Promise((resolve) => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => resolve();
  });
  return apiLoadPromise;
};

const Player = () => {
  const { currentSong, isPlaying, togglePlay, next, prev, setIsPlaying } = usePlayer();
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef(null);
  const loadingVideoRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    loadYouTubeAPI().then(() => {
      if (!mounted || playerRef.current) return;
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            // Ignore buffering/cued events right after loading a new video —
            // these fire before playback actually starts and would otherwise
            // cause a flash of "paused" state right after pressing play.
            if (loadingVideoRef.current) {
              if (e.data === window.YT.PlayerState.PLAYING) {
                loadingVideoRef.current = false;
                setIsPlaying(true);
              }
              return;
            }
            if (e.data === window.YT.PlayerState.ENDED) next();
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
          },
        },
      });
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !currentSong || !playerRef.current) return;
    loadingVideoRef.current = true;
    playerRef.current.loadVideoById(currentSong.videoId);
  }, [currentSong?.videoId, ready]);

  useEffect(() => {
    if (!ready || !playerRef.current || !currentSong) return;
    if (loadingVideoRef.current) return; // let loadVideoById's own PLAYING event handle it
    isPlaying ? playerRef.current.playVideo() : playerRef.current.pauseVideo();
  }, [isPlaying, ready, currentSong]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setProgress(playerRef.current.getCurrentTime() || 0);
        setDuration(playerRef.current.getDuration() || 0);
      }
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    muted ? playerRef.current.unMute() : playerRef.current.mute();
    setMuted((m) => !m);
  };

  const song = currentSong || { name: 'Select a song to play', artist: '—', image: '/2.png' };
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center justify-between bg-white p-3 md:p-4 sticky bottom-0 border-t border-gray-200 z-20">
      <div ref={containerRef} className="hidden" />

      <div className="flex items-center space-x-3 flex-grow min-w-0">
        <img src={song.image} alt="" className="w-10 h-10 rounded shrink-0 object-cover" />
        <div className="flex flex-col min-w-0">
          <span className="text-gray-900 text-sm font-bold truncate max-w-[120px] md:max-w-xs">{song.name}</span>
          <p className="text-gray-500 text-xs truncate">{song.artist}</p>
        </div>
        <p className="text-gray-500 text-xs shrink-0 hidden sm:block">{fmt(progress)}</p>
        <div
          className="w-[30%] bg-gray-200 rounded-md h-1.5 cursor-pointer hidden sm:block"
          onClick={(e) => {
            if (!playerRef.current || !duration) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            playerRef.current.seekTo(ratio * duration, true);
          }}
        >
          <div className="bg-blue-600 rounded-md h-full" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-gray-500 text-xs shrink-0 hidden sm:block">{fmt(duration)}</p>
      </div>

      <div className="flex items-center text-gray-500 shrink-0 space-x-3 md:space-x-4 ml-2">
        <button type="button" aria-label="Previous" onClick={prev} className="hover:text-blue-600">
          <FontAwesomeIcon icon={faBackward} />
        </button>
        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={togglePlay}
          disabled={!currentSong}
          className="w-9 h-9 text-xl text-blue-600 disabled:text-gray-300"
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button type="button" aria-label="Next" onClick={next} className="hover:text-blue-600">
          <FontAwesomeIcon icon={faForward} />
        </button>
        <button type="button" aria-label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute} className="hover:text-blue-600 hidden sm:block">
          <FontAwesomeIcon icon={muted ? faVolumeMute : faVolumeHigh} />
        </button>
      </div>
    </div>
  );
};

export default Player;
