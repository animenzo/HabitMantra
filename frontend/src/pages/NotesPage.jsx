import { NotesProvider, useNotes } from "../context/NotesContext";
import { useNotesSync } from "../hooks/useNotesSync";
import Sidebar from "../components/notes/Sidebar";
import FileCanvas from "../components/notes/FileCanvas";
import SearchBar from "../components/notes/SearchBar";
import { FiMenu, FiBookOpen } from "react-icons/fi";

function NotesContent() {
  useNotesSync();
  const { setSidebarOpen } = useNotes();

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-white overflow-hidden">
      {/* Top Navigation & Search Bar */}
      <header className="px-4 py-2.5 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle explorer sidebar"
          >
            <FiMenu size={18} />
          </button>

          <div className="flex items-center gap-2 text-indigo-700">
            <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100">
              <FiBookOpen size={16} />
            </div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight hidden sm:block">
              My Notes
            </h1>
          </div>
        </div>

        {/* Global Search */}
        <SearchBar />
      </header>

      {/* Main Workspace (Sidebar + Kanban Canvas) */}
      <div className="flex-1 flex overflow-hidden">
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
