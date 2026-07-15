import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/PlayerContext';

const PlayButton = ({ song, list }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const isThis = currentSong && currentSong.id === song.id && currentSong.videoId === song.videoId;

  return (
    <button
      type="button"
      aria-label={isThis && isPlaying ? 'Pause' : 'Play'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        isThis ? togglePlay() : playSong(song, list);
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-12 h-12 rounded-full bg-blue-600 items-center justify-center flex
        opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity shadow-lg"
    >
      <FontAwesomeIcon icon={isThis && isPlaying ? faPauseCircle : faPlayCircle} className="text-white text-2xl" />
    </button>
  );
};

export default PlayButton;
