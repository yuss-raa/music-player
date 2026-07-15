import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SongRow from './SongRow';
import { fetchSongs } from '../data/musicData';

const SongColumn = ({ title, songs }) => (
  <div className="flex flex-col p-3 rounded-lg bg-white border border-gray-100">
    <div className="flex items-center justify-between mb-2 px-1">
      <h2 className="text-gray-900 font-bold">{title}</h2>
      <button type="button" aria-label={`See all ${title}`} className="text-blue-600 hover:text-blue-800">
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
    {songs.map((song) => (
      <SongRow key={song.id} song={song} list={songs} />
    ))}
  </div>
);

const SongGrid = () => {
  const [albums, setAlbums] = useState([]);
  const [singles, setSingles] = useState([]);

  useEffect(() => {
    fetchSongs('new album release', 4).then(setAlbums);
    fetchSongs('new single release', 4).then(setSingles);
  }, []);

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-8">
      <SongColumn title="Latest Album Releases" songs={albums} />
      <SongColumn title="Latest Singles Releases" songs={singles} />
    </div>
  );
};

export default SongGrid;
