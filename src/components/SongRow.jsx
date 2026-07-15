import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/PlayerContext';

const SongRow = ({ song, list }) => {
  const { currentSong, isPlaying, playSong, togglePlay, liked, toggleLike } = usePlayer();
  const isThis = currentSong && currentSong.videoId === song.videoId;
  const added = !!liked[`add-${song.id}`];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => (isThis ? togglePlay() : playSong(song, list))}
      className={`p-3 rounded-lg mb-1 flex items-center justify-between cursor-pointer transition-colors
        ${isThis ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      <div className="flex items-center min-w-0">
        <button
          type="button"
          aria-label={isThis && isPlaying ? 'Pause' : 'Play'}
          onClick={(e) => { e.stopPropagation(); isThis ? togglePlay() : playSong(song, list); }}
          className="mr-3 text-blue-600 shrink-0 w-5"
        >
          <FontAwesomeIcon icon={isThis && isPlaying ? faPause : faPlay} />
        </button>
        <button
          type="button"
          aria-label={added ? 'Remove from playlist' : 'Add to playlist'}
          onClick={(e) => { e.stopPropagation(); toggleLike(`add-${song.id}`); }}
          className={`mr-3 shrink-0 ${added ? 'text-green-600' : 'text-gray-500'}`}
        >
          <FontAwesomeIcon icon={added ? faCheck : faPlus} />
        </button>
        <img src={song.image} alt="" className="mr-3 w-8 h-8 rounded shrink-0 object-cover" />
        <div className="min-w-0">
          <span className="block text-gray-900 text-sm font-semibold mb-0.5 truncate">{song.name}</span>
          <p className="text-gray-500 text-xs truncate">{song.artist}</p>
        </div>
      </div>
      <div className="flex items-center shrink-0">
        <p className="text-gray-500 text-xs">{song.duration}</p>
      </div>
    </div>
  );
};

export default SongRow;