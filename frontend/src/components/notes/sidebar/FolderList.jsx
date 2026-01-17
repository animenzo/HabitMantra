import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNotes } from "../../../context/NotesContext";
import FileList from "./FileList";

export default function FolderList() {
  const [folders, setFolders] = useState([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const { activeFolder, setActiveFolder } = useNotes();

  useEffect(() => {
    API.get("/notes/folders").then((res) => {
      setFolders(res.data);
      if (!activeFolder && res.data.length) {
        setActiveFolder(res.data[0]._id);
      }
    });
  }, []);

  /* ---------- CRUD ---------- */

  const createFolder = async () => {
    if (!newName.trim()) return;

    const res = await API.post("/notes/folders", {
      name: newName,
      order: folders.length,
    });

    setFolders([...folders, res.data]);
    setNewName("");
    setCreating(false);
    setActiveFolder(res.data._id);
  };

  const updateFolder = async (id, name) => {
    const res = await API.patch(`/notes/folders/${id}`, { name });
    setFolders(folders.map(f => (f._id === id ? res.data : f)));
  };

  const deleteFolder = async (id) => {
    await API.delete(`/notes/folders/${id}`);
    setFolders(folders.filter(f => f._id !== id));
    if (activeFolder === id) setActiveFolder(null);
  };

  return (
    <div className="space-y-2">
      {folders.map(folder => (
        <FolderItem
          key={folder._id}
          folder={folder}
          active={activeFolder === folder._id}
          onSelect={() => setActiveFolder(folder._id)}
          onUpdate={updateFolder}
          onDelete={deleteFolder}
        />
      ))}

      {/* Create folder */}
      {creating ? (
        <input
          autoFocus
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && createFolder()}
          onBlur={() => setCreating(false)}
          placeholder="New folder..."
          className="w-full border rounded px-2 py-1 text-sm"
        />
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-sm text-gray-500 hover:text-black"
        >
          + New Folder
        </button>
      )}
    </div>
  );
}

/* ---------- Folder Item ---------- */

function FolderItem({ folder, active, onSelect, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(folder.name);

  const save = () => {
    setEditing(false);
    if (name !== folder.name) {
      onUpdate(folder._id, name);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between px-2 py-1 rounded ${
          active ? "bg-gray-200" : ""
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
            📁 {folder.name}
          </button>
        )}

        <button
          onClick={() => onDelete(folder._id)}
          className="text-xs text-red-400 ml-2"
        >
          ✕
        </button>
      </div>

      {active && <FileList folderId={folder._id} />}
    </div>
  );
}
