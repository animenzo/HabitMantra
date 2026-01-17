import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNotes } from "../../../context/NotesContext";

export default function FileList({ folderId }) {
  const [files, setFiles] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const { activeFile, setActiveFile } = useNotes();

  useEffect(() => {
    API.get(`/notes/files/${folderId}`).then(res => {
      setFiles(res.data);
      if (!activeFile && res.data.length) {
        setActiveFile(res.data[0]._id);
      }
    });
  }, [folderId]);

  /* ---------- CRUD ---------- */

  const createFile = async () => {
    if (!newName.trim()) return;

    const res = await API.post("/notes/files", {
      folderId,
      name: newName,
      order: files.length,
    });

    setFiles([...files, res.data]);
    setNewName("");
    setCreating(false);
    setActiveFile(res.data._id);
  };

  const updateFile = async (id, name) => {
    const res = await API.patch(`/notes/files/${id}`, { name });
    setFiles(files.map(f => (f._id === id ? res.data : f)));
  };

  const deleteFile = async (id) => {
    await API.delete(`/notes/files/${id}`);
    setFiles(files.filter(f => f._id !== id));
    if (activeFile === id) setActiveFile(null);
  };

  return (
    <div className="ml-4 mt-1 space-y-1">
      {files.map(file => (
        <FileItem
          key={file._id}
          file={file}
          active={activeFile === file._id}
          onSelect={() => setActiveFile(file._id)}
          onUpdate={updateFile}
          onDelete={deleteFile}
        />
      ))}

      {creating ? (
        <input
          autoFocus
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && createFile()}
          onBlur={() => setCreating(false)}
          placeholder="New file..."
          className="w-full border rounded px-2 py-1 text-sm"
        />
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-xs text-gray-500 hover:text-black"
        >
          + New File
        </button>
      )}
    </div>
  );
}

/* ---------- File Item ---------- */

function FileItem({ file, active, onSelect, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(file.name);

  const save = () => {
    setEditing(false);
    if (name !== file.name) {
      onUpdate(file._id, name);
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-2 py-1 rounded ${
        active ? "bg-gray-100" : ""
      }`}
    >
      {editing ? (
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={save}
          onKeyDown={e => e.key === "Enter" && save()}
          className="w-full border rounded px-1 text-sm"
        />
      ) : (
        <button
          onClick={onSelect}
          onDoubleClick={() => setEditing(true)}
          className="flex-1 text-left text-sm"
        >
          📄 {file.name}
        </button>
      )}

      <button
        onClick={() => onDelete(file._id)}
        className="text-xs text-red-400 ml-2"
      >
        ✕
      </button>
    </div>
  );
}
