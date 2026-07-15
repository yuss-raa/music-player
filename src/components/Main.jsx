import React, { useEffect, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import AlbumCard from './AlbumCard';
import SongGrid from './SongGrid';
import SongRow from './SongRow';
import Player from './Player';
import { fetchSongs, categoryQueries } from '../data/musicData';
import { usePlayer } from '../context/PlayerContext';

const SECTION_LABELS = {
  discover: 'Discover', genre: 'Genre', 'top-charts': 'Top Charts',
  collabs: 'Collabs', 'free-music': 'Free Music', stations: 'Stations',
  favourites: 'Favourites', history: 'History',
  public: 'Public Playlist', purchased: 'Purchased', 'my-first': 'My First Playlists',
  search: 'Search Results',
};

const Main = () => {
  const [albums, setAlbums] = useState([]);
  const [sectionSongs, setSectionSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { activeSection, liked, searchQuery } = usePlayer();

  // Hero + Noteworthy Albums pull from these genres, mixed together
  useEffect(() => {
    Promise.all([
      fetchSongs('bollywood hits 2026', 2),
      fetchSongs('BTS songs', 2),
      fetchSongs('NCS no copyright sounds', 2),
    ]).then(([bolly, bts, ncs]) => {
      setAlbums([...bolly, ...bts, ...ncs]);
    });
  }, []);

  useEffect(() => {
    if (activeSection === 'search') {
      if (!searchQuery) {
        setSectionSongs([]);
        return;
      }
      setLoading(true);
      fetchSongs(searchQuery, 10).then((songs) => {
        setSectionSongs(songs);
        setLoading(false);
      });
      return;
    }
    const query = categoryQueries[activeSection];
    if (!query) {
      setSectionSongs([]);
      return;
    }
    setLoading(true);
    fetchSongs(query, 8).then((songs) => {
      setSectionSongs(songs);
      setLoading(false);
    });
  }, [activeSection, searchQuery]);

  const isDiscover = activeSection === 'discover';
  const isFavourites = activeSection === 'favourites';
  const isHistory = activeSection === 'history';

  const likedSongs = [...albums, ...sectionSongs].filter((s) => liked[s.id]);

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white text-gray-900 p-4 sm:p-6 md:p-10 flex-1 md:ml-[18%] min-h-screen flex flex-col">
      <Header />

      <div className="relative flex-1">
        {isDiscover ? (
          <>
            <Hero featured={albums[0]} />

            <div>
              <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mt-10 mb-2">Noteworthy Albums</h2>
              <p className="text-sm font-medium text-gray-500 mb-6">
                Get better recommendations{' '}
                <a href="#" className="text-blue-600 underline ml-2">
                  defining your taste
                </a>
              </p>
            </div>

            <div className="grid md:grid-cols-6 sm:grid-cols-3 grid-cols-2 gap-3">
              {albums.map((album) => (
                <AlbumCard key={album.id} album={album} />
              ))}
            </div>

            <SongGrid />
          </>
        ) : (
          <div>
            <h2 className="text-xl sm:text-2xl text-gray-900 font-bold mt-4 mb-6">
              {activeSection === 'search' ? `Results for "${searchQuery}"` : (SECTION_LABELS[activeSection] || 'Music')}
            </h2>

            {isFavourites && (
              likedSongs.length ? (
                <div className="bg-white rounded-lg border border-gray-100 p-3">
                  {likedSongs.map((song) => (
                    <SongRow key={song.id} song={song} list={likedSongs} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No favourites yet. Tap the heart icon on any album to add it here.</p>
              )
            )}

            {isHistory && (
              <p className="text-gray-500 text-sm">Your recently played songs will show up here once you start listening.</p>
            )}

            {!isFavourites && !isHistory && (
              loading ? (
                <p className="text-gray-500 text-sm">Loading...</p>
              ) : sectionSongs.length ? (
                <div className="bg-white rounded-lg border border-gray-100 p-3">
                  {sectionSongs.map((song) => (
                    <SongRow key={song.id} song={song} list={sectionSongs} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No results found. Try a different search.</p>
              )
            )}
          </div>
        )}
      </div>

      <Player />
    </div>
  );
};

export default Main;
