import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faPlayCircle, faPauseCircle } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/PlayerContext';

const Hero = ({ featured }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const [bookmarked, setBookmarked] = useState(false);
  const isFeaturedPlaying = featured && currentSong && currentSong.videoId === featured.videoId && isPlaying;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 mb-4 text-gray-900">
        What&apos;s hot this <br /> weekend?
      </h1>
      <p className="text-sm sm:text-base font-medium text-gray-600 mb-6 max-w-md">
        A few tracks worth your time right now.
      </p>
      <div className="flex items-center space-x-4 mb-6">
        <button
          disabled={!featured}
          onClick={() => {
            if (!featured) return;
            const song = { id: `album-${featured.id}`, name: featured.title, artist: featured.artist, image: featured.image, videoId: featured.videoId, duration: featured.duration };
            const isThis = currentSong && currentSong.videoId === song.videoId;
            isThis ? togglePlay() : playSong(song);
          }}
          className="relative bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-lg text-white font-semibold py-2.5 pl-6 pr-12 rounded-full transition-colors"
        >
          {isFeaturedPlaying ? 'Pause' : 'Listen'}
          <FontAwesomeIcon
            icon={isFeaturedPlaying ? faPauseCircle : faPlayCircle}
            className="absolute top-1/2 right-3 -translate-y-1/2 w-6 h-6"
          />
        </button>
        <button
          type="button"
          aria-label="Bookmark"
          onClick={() => setBookmarked((b) => !b)}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-colors
            ${bookmarked ? 'bg-yellow-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          <FontAwesomeIcon icon={faBookmark} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Hero;
