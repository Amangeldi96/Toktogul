// SongsContext.js
import { createContext, useContext, useState } from 'react';

const SongsContext = createContext();

export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  
  const addSong = (song) => {
    setSongs((prevSongs) => [...prevSongs, song]);
  };

  return (
    <SongsContext.Provider value={{ songs, addSong }}>
      {children}
    </SongsContext.Provider>
  );
};

export const useSongs = () => {
  const context = useContext(SongsContext);
  if (context === undefined) {
    throw new Error('useSongs must be used within a SongsProvider');
  }
  return context;
};
