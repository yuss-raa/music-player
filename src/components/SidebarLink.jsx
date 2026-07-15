import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass, faHeadphones, faHeart, faHistory, faList,
  faPlayCircle, faMusic, faChartLine, faUserFriends, faBroadcastTower,
} from '@fortawesome/free-solid-svg-icons';

const ICONS = {
  faCompass, faHeadphones, faHeart, faHistory, faList,
  faPlayCircle, faMusic, faChartLine, faUserFriends, faBroadcastTower,
};

const SidebarLink = ({ label, icon, active, onClick }) => (
  <li
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    className={`relative flex items-center space-x-2 group cursor-pointer py-1.5 px-2 rounded transition-colors
      ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}
  >
    <div className={`absolute left-0 w-1 h-6 bg-blue-600 rounded-r transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
    <FontAwesomeIcon icon={ICONS[icon]} className="w-4" />
    <span className="font-semibold text-sm">{label}</span>
  </li>
);

export default SidebarLink;
