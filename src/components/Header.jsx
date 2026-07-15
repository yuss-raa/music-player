import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faSearch, faTimes, faCog, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/PlayerContext';

const Header = () => {
  const [query, setQuery] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { setSearchQuery, setActiveSection, resetAll } = usePlayer();

  const notifications = [
    'New release from Flume just dropped',
    'BTS added a new single to Top Charts',
    'Your Favourites playlist was updated',
  ];

  const runSearch = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setActiveSection('search');
  };

  const clearSearch = () => {
    setQuery('');
    setSearchQuery('');
    setActiveSection('discover');
  };

  return (
    <div className="flex justify-between items-center mb-6 mt-14 md:mt-0 gap-3">
      <form
        onSubmit={(e) => { e.preventDefault(); runSearch(query); }}
        className="relative flex items-center flex-1 max-w-md"
      >
        <FontAwesomeIcon icon={faSearch} className="text-gray-500 absolute left-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists..."
          aria-label="Search"
          className="bg-white text-gray-900 placeholder-gray-400 pl-10 py-2 pr-9 rounded-full w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clearSearch}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </form>

      <div className="flex items-center space-x-4 relative">
        <button type="button" aria-label="Notifications" onClick={() => { setShowNotif((s) => !s); setShowProfile(false); }}>
          <FontAwesomeIcon icon={faBell} className="text-gray-700 text-xl hover:text-blue-600" />
        </button>
        {showNotif && (
          <div className="absolute top-8 right-10 bg-white shadow-lg rounded-lg p-2 w-64 text-sm text-gray-700 z-20 border border-gray-100">
            {notifications.map((n, i) => (
              <p key={i} className="px-2 py-2 hover:bg-gray-50 rounded">{n}</p>
            ))}
          </div>
        )}

        <button type="button" aria-label="Profile menu" onClick={() => { setShowProfile((s) => !s); setShowNotif(false); }}>
          <FontAwesomeIcon icon={faUser} className="text-gray-700 text-xl hover:text-blue-600" />
        </button>
        {showProfile && (
          <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg py-2 w-48 text-sm text-gray-700 z-20 border border-gray-100">
            <button type="button" className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50">
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-500" /> Profile
            </button>
            <button type="button" className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50">
              <FontAwesomeIcon icon={faCog} className="text-gray-500" /> Settings
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              type="button"
              onClick={() => { resetAll(); setShowProfile(false); }}
              className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-red-500"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

