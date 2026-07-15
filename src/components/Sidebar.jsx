import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SidebarLink from './SidebarLink';
import { browseMusicLinks, yourMusicLinks, playlistLinks } from '../data/musicData';
import { usePlayer } from '../context/PlayerContext';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { activeSection, setActiveSection } = usePlayer();

  const Section = ({ title, links }) => (
    <>
      <h3 className="mt-5 ml-2 font-bold text-gray-400 text-xs tracking-wider">{title}</h3>
      <ul className="mt-2 space-y-1">
        {links.map((link) => (
          <SidebarLink
            key={link.id}
            label={link.label}
            icon={link.icon}
            active={activeSection === link.id}
            onClick={() => {
              setActiveSection(link.id);
              setOpen(false);
            }}
          />
        ))}
      </ul>
    </>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white z-30 flex items-center justify-between px-4 shadow">
        <h2 className="text-blue-600 text-lg font-bold">Music Player</h2>
        <button aria-label="Open menu" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faBars} className="text-xl text-gray-700" />
        </button>
      </div>

      {/* overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`bg-white fixed top-0 left-0 h-full overflow-y-auto z-50 w-72 px-4 pb-8 shadow-xl
          transition-transform duration-300 md:translate-x-0 md:shadow-none md:w-[18%] md:min-w-[220px]
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between pt-4">
          <h2 className="text-blue-600 text-xl font-bold">Music Player</h2>
          <button aria-label="Close menu" className="md:hidden" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faTimes} className="text-xl text-gray-700" />
          </button>
        </div>

        <Section title="BROWSE MUSIC" links={browseMusicLinks} />
        <Section title="YOUR MUSIC" links={yourMusicLinks} />
        <Section title="YOUR PLAYLISTS" links={playlistLinks} />
      </aside>
    </>
  );
};

export default Sidebar;
