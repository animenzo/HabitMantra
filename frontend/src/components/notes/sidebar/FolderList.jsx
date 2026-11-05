import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNotes } from "../../../context/NotesContext";
import FileList from "./FileList";
import {
  FiFolder,
  FiFolderPlus,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
} from "react-icons/fi";

export default function FolderList() {
  const [folders, setFolders] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const { activeFolder, setActiveFolder } = useNotes();

  useEffect(() => {
    API.get("/notes/folders")
      .then((res) => {
        setFolders(res.data || []);
        if (!activeFolder && res.data?.length) {
          setActiveFolder(res.data[0]._id);
        }
      })
      .catch((err) => console.error("Failed to load folders", err));
  }, []);

  const createFolder = async () => {
    if (!newName.trim()) return;

    try {
      const res = await API.post("/notes/folders", {
        name: newName.trim(),
        order: folders.length,
      });

      setFolders([...folders, res.data]);
      setNewName("");
      setCreating(false);
      setActiveFolder(res.data._id);
    } catch (err) {
      console.error("Failed to create folder", err);
    }
  };

  const updateFolder = async (id, name) => {
    if (!name.trim()) return;
    try {
      const res = await API.patch(`/notes/folders/${id}`, { name: name.trim() });
      setFolders(folders.map((f) => (f._id === id ? res.data : f)));
    } catch (err) {
      console.error("Failed to update folder", err);
    }
  };

  const deleteFolder = async (id) => {
    try {
      await API.delete(`/notes/folders/${id}`);
      const remaining = folders.filter((f) => f._id !== id);
      setFolders(remaining);
      if (activeFolder === id) {
        setActiveFolder(remaining[0]?._id || null);
      }
    } catch (err) {
      console.error("Failed to delete folder", err);
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Create Folder Trigger */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Folders
        </span>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 p-1 rounded-lg hover:bg-indigo-50 transition-colors"
          title="Create new folder"
        >
          <FiFolderPlus size={14} />
          <span>New</span>
        </button>
      </div>

      {creating && (
        <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl mb-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createFolder();
              if (e.key === "Escape") setCreating(false);
            }}
            placeholder="Folder name..."
            className="w-full bg-white border border-indigo-400 rounded-lg px-2.5 py-1 text-xs text-slate-900 outline-none font-medium"
          />
          <button
            onClick={createFolder}
            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
            title="Create folder"
          >
            <FiCheck size={14} />
          </button>
          <button
            onClick={() => setCreating(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            title="Cancel"
          >
            <FiX size={14} />
          </button>
        </div>
      )}

      {folders.length === 0 && !creating && (
        <div className="py-6 text-center text-xs text-slate-400 font-medium">
          No folders yet. Click New to organize notes.
        </div>
      )}

      {folders.map((folder) => (
        <FolderItem
          key={folder._id}
          folder={folder}
          active={activeFolder === folder._id}
          onSelect={() => setActiveFolder(folder._id)}
          onUpdate={updateFolder}
          onDelete={deleteFolder}
        />
      ))}
    </div>
  );
}

function FolderItem({ folder, active, onSelect, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);

  const save = () => {
    setEditing(false);
    if (name.trim() && name !== folder.name) {
      onUpdate(folder._id, name);
    } else {
      setName(folder.name);
    }
  };

  return (
    <div className="space-y-0.5">
      <div
        className={`group flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer ${
          active
            ? "bg-slate-100/90 text-slate-900 font-bold"
            : "text-slate-700 hover:bg-slate-50 font-medium"
        }`}
      >
        {editing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                setName(folder.name);
                setEditing(false);
              }
            }}
            className="w-full bg-white border border-indigo-400 rounded-lg px-2 py-0.5 text-xs text-slate-900 outline-none font-medium"
          />
        ) : (
          <button
            onClick={onSelect}
            className="flex items-center gap-2 flex-1 text-left text-xs truncate"
          >
            {active ? (
              <FiChevronDown size={14} className="text-indigo-600 shrink-0" />
            ) : (
              <FiChevronRight size={14} className="text-slate-400 shrink-0" />
            )}
            <FiFolder
              size={15}
              className={`shrink-0 ${active ? "text-indigo-600" : "text-slate-500"}`}
            />
            <span className="truncate">{folder.name}</span>
          </button>
        )}

        {/* Hover action buttons */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Rename folder"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete folder "${folder.name}" and all its files?`)) {
                onDelete(folder._id);
              }
            }}
            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete folder"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>

      {active && <FileList folderId={folder._id} />}
    </div>
  );
}
