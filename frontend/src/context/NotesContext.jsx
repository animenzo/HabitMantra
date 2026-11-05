import { createContext, useContext, useEffect, useState } from "react";
import { loadNotesCache, saveNotesCache } from "../utils/localNotes";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState({});
  const [cards, setCards] = useState({});
  const [blocks, setBlocks] = useState({});
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Load from localStorage FIRST */
  useEffect(() => {
    const cached = loadNotesCache();
    if (cached) {
      setFolders(cached.folders || []);
      setFiles(cached.files || {});
      setCards(cached.cards || {});
      setBlocks(cached.blocks || {});
      setActiveFolder(cached.activeFolder || null);
      setActiveFile(cached.activeFile || null);
    }
  }, []);

  /* Save to localStorage on change */
  useEffect(() => {
    saveNotesCache({
      folders,
      files,
      cards,
      blocks,
      activeFolder,
      activeFile,
    });
  }, [folders, files, cards, blocks, activeFolder, activeFile]);

  return (
    <NotesContext.Provider
      value={{
        folders,
        setFolders,
        files,
        setFiles,
        cards,
        setCards,
        blocks,
        setBlocks,
        activeFolder,
        setActiveFolder,
        activeFile,
        setActiveFile,
        highlightedBlock,
        setHighlightedBlock,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
