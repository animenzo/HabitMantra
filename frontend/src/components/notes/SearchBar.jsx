import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNotes } from "../../context/NotesContext";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);

  const { setActiveFolder, setActiveFile,setHighlightedBlock } = useNotes();

  useEffect(() => {
    if (!q.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      API.get(`/notes/search?q=${q}`).then(res => {
        setResults(res.data);
      });
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [q]);

  const jumpToBlock = (block) => {
    setActiveFolder(block.folderId);
    setActiveFile(block.fileId);
    setHighlightedBlock(block._id);
    setQ("");
    setResults(null);
  };

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search notes..."
        className="w-full border rounded px-3 py-2 text-sm"
      />

      {results && (
        <div className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-64 overflow-auto">
          <Section title="Blocks">
            {results.blocks.map(b => (
              <Item
                key={b._id}
                text={b.content}
                query={q}
                onClick={() => jumpToBlock(b)}
              />
            ))}
          </Section>

          <Section title="Cards">
            {results.cards.map(c => (
              <Item key={c._id} query={q} text={c.title} />
            ))}
          </Section>

          <Section title="Files">
            {results.files.map(f => (
              <Item key={f._id} query={q} text={f.name} />
            ))}
          </Section>

          <Section title="Folders">
            {results.folders.map(f => (
              <Item key={f._id} query={q} text={f.name} />
            ))}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  if (!children.length) return null;
  return (
    <div className="p-2">
      <div className="text-xs text-gray-400 mb-1">{title}</div>
      {children}
    </div>
  );
}
 const highlight = (text, query) => {
  if (!query) return text;

  return text.replace(
    new RegExp(`(${query})`, "ig"),
    "<mark>$1</mark>"
  );
};

function Item({ text, query, onClick }) {
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
      className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer rounded"
      dangerouslySetInnerHTML={{
        __html: highlight(text, query),
      }}
    />
  );
}


