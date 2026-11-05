import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNotes } from "../../../context/NotesContext";
import { FiFileText, FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";

export default function FileList({ folderId }) {
  const [files, setFiles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const { activeFile, setActiveFile, setSidebarOpen } = useNotes();

  useEffect(() => {
    API.get(`/notes/files/${folderId}`)
      .then((res) => {
        setFiles(res.data || []);
        if (!activeFile && res.data?.length) {
          setActiveFile(res.data[0]._id);
        }
      })
      .catch((err) => console.error("Failed to load files", err));
  }, [folderId]);

  const createFile = async () => {
    if (!newName.trim()) return;

    try {
      const res = await API.post("/notes/files", {
        folderId,
        name: newName.trim(),
        order: files.length,
      });

      setFiles([...files, res.data]);
      setNewName("");
      setCreating(false);
      setActiveFile(res.data._id);
    } catch (err) {
      console.error("Failed to create file", err);
    }
  };

  const updateFile = async (id, name) => {
    if (!name.trim()) return;
    try {
      const res = await API.patch(`/notes/files/${id}`, { name: name.trim() });
      setFiles(files.map((f) => (f._id === id ? res.data : f)));
    } catch (err) {
      console.error("Failed to update file", err);
    }
  };

  const deleteFile = async (id) => {
    try {
      await API.delete(`/notes/files/${id}`);
      const remaining = files.filter((f) => f._id !== id);
      setFiles(remaining);
      if (activeFile === id) {
        setActiveFile(remaining[0]?._id || null);
      }
    } catch (err) {
      console.error("Failed to delete file", err);
    }
  };

  return (
    <div className="ml-5 pl-2.5 border-l border-slate-200/80 my-1 space-y-1">
      {files.map((file) => (
        <FileItem
          key={file._id}
          file={file}
          active={activeFile === file._id}
          onSelect={() => {
            setActiveFile(file._id);
            // On mobile, close drawer after picking file
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
          onUpdate={updateFile}
          onDelete={deleteFile}
        />
      ))}

      {creating ? (
        <div className="flex items-center gap-1 mt-1 pr-1">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") createFile();
              if (e.key === "Escape") setCreating(false);
            }}
            placeholder="File name..."
            className="w-full bg-white border border-indigo-400 rounded-lg px-2 py-1 text-xs text-slate-900 outline-none font-medium"
          />
          <button
            onClick={createFile}
            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
            title="Save"
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
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-50/50 transition-colors w-full text-left"
        >
          <FiPlus size={12} />
          <span>New File</span>
        </button>
      )}
    </div>
  );
}

function FileItem({ file, active, onSelect, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(file.name);

  const save = () => {
    setEditing(false);
    if (name.trim() && name !== file.name) {
      onUpdate(file._id, name);
    } else {
      setName(file.name);
    }
  };

  return (
    <div
      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all text-xs ${
        active
          ? "bg-indigo-50/90 text-indigo-800 font-semibold shadow-2xs border border-indigo-200/60"
          : "text-slate-700 hover:bg-slate-100/70"
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
              setName(file.name);
              setEditing(false);
            }
          }}
          className="w-full bg-white border border-indigo-400 rounded px-1.5 py-0.5 text-xs text-slate-900 outline-none font-medium"
        />
      ) : (
        <button
          onClick={onSelect}
          className="flex items-center gap-2 flex-1 text-left truncate"
        >
          <FiFileText
            size={13}
            className={`shrink-0 ${active ? "text-indigo-600" : "text-slate-400"}`}
          />
          <span className="truncate">{file.name}</span>
        </button>
      )}

      {/* Hover actions */}
      <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          title="Rename file"
        >
          <FiEdit2 size={11} />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Delete file "${file.name}" and all its notes?`)) {
              onDelete(file._id);
            }
          }}
          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete file"
        >
          <FiTrash2 size={11} />
        </button>
      </div>
    </div>
  );
}
