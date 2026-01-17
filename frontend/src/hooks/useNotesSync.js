import { useEffect } from "react";
import API from "../services/api";
import { useNotes } from "../context/NotesContext";

export const useNotesSync = () => {
  const {
    setFolders,
    setFiles,
    setCards,
    setBlocks,
  } = useNotes();

  useEffect(() => {
    const sync = async () => {
      const [folders, files, cards, blocks] = await Promise.all([
        API.get("/notes/folders"),
        API.get("/notes/files/all"),
        API.get("/notes/cards/all"),
        API.get("/notes/blocks/all"),
      ]);
      
      setFolders(folders.data);

      const map = (arr, key) =>
        arr.reduce((a, c) => {
          a[c[key]] = (a[c[key]] || []).concat(c);
          return a;
        }, {});

      setFiles(map(files.data, "folderId"));
      setCards(map(cards.data, "fileId"));
      setBlocks(map(blocks.data, "cardId"));
    };

    sync();
  }, []);
};
