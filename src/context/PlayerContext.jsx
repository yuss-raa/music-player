import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState({});
  const [activeSection, setActiveSection] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');

  const currentSong = queue[index] || null;

  const playSong = (song, list = null) => {
    if (list) {
      const i = list.findIndex((s) => s.videoId === song.videoId);
      setQueue(list);
      setIndex(i >= 0 ? i : 0);
    } else {
      setQueue([song]);
      setIndex(0);
    }
    setIsPlaying(true);
  };

  const togglePlay = () => currentSong && setIsPlaying((p) => !p);
  const next = () => queue.length && setIndex((i) => (i + 1) % queue.length);
  const prev = () => queue.length && setIndex((i) => (i - 1 + queue.length) % queue.length);
  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  const resetAll = () => {
    setQueue([]);
    setIndex(0);
    setIsPlaying(false);
    setLiked({});
    setActiveSection('discover');
    setSearchQuery('');
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong, isPlaying, playSong, togglePlay, next, prev,
        liked, toggleLike, setIsPlaying,
        activeSection, setActiveSection,
        searchQuery, setSearchQuery, resetAll,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
