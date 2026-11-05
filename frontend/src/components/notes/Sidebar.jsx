import FolderList from "./sidebar/FolderList";
import { useNotes } from "../../context/NotesContext";
import { FiX, FiLayers } from "react-icons/fi";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useNotes();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between">
      <div>
        {/* Sidebar Brand / Title */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-indigo-700">
            <FiLayers size={18} />
            <h2 className="font-bold text-sm tracking-tight text-slate-900">Notes Explorer</h2>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tree List */}
        <FolderList />
      </div>

      {/* Footer Info */}
      <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
        <span>HabitMantra Notes • Drag & organize</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 border-r border-slate-200/90 bg-white p-4 shrink-0 overflow-y-auto custom-scrollbar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl p-4 overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
