import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import { useNotes } from "../../context/NotesContext";
import { FiSearch, FiX, FiFileText, FiFolder, FiLayout, FiCheckSquare } from "react-icons/fi";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const { setActiveFolder, setActiveFile, setHighlightedBlock } = useNotes();

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      API.get(`/notes/search?q=${encodeURIComponent(q.trim())}`)
        .then((res) => {
          setResults(res.data);
        })
        .catch((err) => console.error("Search failed", err))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [q]);

  // Close search results dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const jumpToBlock = (block) => {
    if (block.folderId) setActiveFolder(block.folderId);
    if (block.fileId) setActiveFile(block.fileId);
    setHighlightedBlock(block._id);
    setQ("");
    setResults(null);
  };

  const jumpToFile = (file) => {
    if (file.folderId) setActiveFolder(file.folderId);
    setActiveFile(file._id);
    setQ("");
    setResults(null);
  };

  const jumpToFolder = (folder) => {
    setActiveFolder(folder._id);
    setQ("");
    setResults(null);
  };

  const hasAnyResults =
    results &&
    (results.blocks?.length ||
      results.cards?.length ||
      results.files?.length ||
      results.folders?.length);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <FiSearch className="text-slate-400 shrink-0 text-sm" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search all notes, cards, and files..."
          className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-medium"
        />
        {q && (
          <button
            onClick={() => {
              setQ("");
              setResults(null);
            }}
            className="text-slate-400 hover:text-slate-600 p-0.5"
          >
            <FiX size={14} />
          </button>
        )}
      </div>

      {results && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-80 overflow-y-auto divide-y divide-slate-100 p-2 animate-in fade-in duration-150">
          {!hasAnyResults && !loading && (
            <div className="py-6 text-center text-xs text-slate-500 font-medium">
              No matching notes found for "{q}"
            </div>
          )}

          {results.blocks?.length > 0 && (
            <Section title="Note Blocks" icon={FiCheckSquare} count={results.blocks.length}>
              {results.blocks.map((b) => (
                <Item
                  key={b._id}
                  text={b.content}
                  query={q}
                  onClick={() => jumpToBlock(b)}
                />
              ))}
            </Section>
          )}

          {results.cards?.length > 0 && (
            <Section title="Card Columns" icon={FiLayout} count={results.cards.length}>
              {results.cards.map((c) => (
                <Item key={c._id} query={q} text={c.title} />
              ))}
            </Section>
          )}

          {results.files?.length > 0 && (
            <Section title="Files" icon={FiFileText} count={results.files.length}>
              {results.files.map((f) => (
                <Item key={f._id} query={q} text={f.name} onClick={() => jumpToFile(f)} />
              ))}
            </Section>
          )}

          {results.folders?.length > 0 && (
            <Section title="Folders" icon={FiFolder} count={results.folders.length}>
              {results.folders.map((f) => (
                <Item key={f._id} query={q} text={f.name} onClick={() => jumpToFolder(f)} />
              ))}
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, count, children }) {
  return (
    <div className="py-2 first:pt-1 last:pb-1">
      <div className="flex items-center gap-1.5 px-2.5 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <Icon size={12} className="text-slate-400" />
        <span>{title}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 ml-auto">
          {count}
        </span>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

const highlight = (text = "", query = "") => {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(
    new RegExp(`(${escaped})`, "ig"),
    '<span class="bg-indigo-100 text-indigo-900 font-bold px-0.5 rounded">$1</span>'
  );
};

function Item({ text = "", query, onClick }) {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);

  const handleClick = () => {
    if (urlMatch) {
      window.open(urlMatch[0], "_blank");
    } else {
      onClick?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 cursor-pointer rounded-lg font-medium truncate transition-colors"
      dangerouslySetInnerHTML={{
        __html: highlight(text, query),
      }}
    />
  );
}
