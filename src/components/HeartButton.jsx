import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const HeartButton = ({ id }) => {
  const { liked, toggleLike } = usePlayer();
  const isLiked = !!liked[id];

  return (
    <button
      type="button"
      aria-label={isLiked ? 'Remove from favourites' : 'Add to favourites'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(id);
      }}
      className={`w-9 h-9 rounded-full absolute top-2 right-2 items-center justify-center flex transition-colors
        ${isLiked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100'}`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="currentColor"
          d="M12 21.35L3.38 12.73a6.47 6.47 0 0 1 0-9.16 6.48 6.48 0 0 1 9.16 0L12 3.19l-.54-.54a6.48 6.48 0 0 1 9.16 0 6.47 6.47 0 0 1 0 9.16L12 21.35z"
        />
      </svg>
    </button>
  );
};

export default HeartButton;