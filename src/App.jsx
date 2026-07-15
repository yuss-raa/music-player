import React from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import { PlayerProvider } from './context/PlayerContext';

const App = () => {
  return (
    <PlayerProvider>
      <div className="flex">
        <Sidebar />
        <Main />
      </div>
    </PlayerProvider>
  );
};

export default App;
