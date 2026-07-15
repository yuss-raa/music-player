import React from 'react';
import HeartButton from './HeartButton';
import PlayButton from './PlayButton';
import { usePlayer } from '../context/PlayerContext';

const AlbumCard = ({ album }) => {
  const { playSong } = usePlayer();
  const song = { id: album.id, name: album.title, artist: album.artist, image: album.image, videoId: album.videoId, duration: album.duration || '—' };

  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); playSong(song); }}
      className="relative bg-white z-10 p-3 rounded-lg hover:shadow-xl group transition-shadow border border-gray-100"
    >
      <div className="pt-[100%] relative mb-3">
        <img
          src={album.image}
          alt={`${album.title} by ${album.artist}`}
          className="absolute inset-0 object-cover w-full h-full rounded shadow-md"
        />
        <HeartButton id={song.id} />
        <PlayButton song={song} />
      </div>
      <h6 className="overflow-hidden overflow-ellipsis text-gray-900 whitespace-nowrap text-sm font-semibold">
        {album.title}
      </h6>
      <p className="line-clamp-2 text-gray-500 text-xs mt-1">{album.artist}</p>
    </a>
  );
};

export default AlbumCard;
