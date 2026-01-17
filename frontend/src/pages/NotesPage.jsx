import { NotesProvider } from "../context/NotesContext";
import { useNotesSync } from "../hooks/useNotesSync";
import Sidebar from "../components/notes/Sidebar";
import FileCanvas from "../components/notes/FileCanvas";
import SearchBar from "../components/notes/SearchBar";

function NotesContent() {
  useNotesSync();
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <SearchBar />
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* sidebar + canvas */}
        <Sidebar />
        <FileCanvas />
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <NotesProvider>
      <NotesContent />
    </NotesProvider>
  );
}
