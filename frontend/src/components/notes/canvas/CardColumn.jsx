import { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { useNotes } from "../../../context/NotesContext";
import { linkify } from "../../../utils/linkify";
export default function CardColumn({
  card,
  onDelete,
  onUpdate,
  onCreateBlock,
  onUpdateBlock,
  onDeleteBlock,
}) {
  const [title, setTitle] = useState(card.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newBlock, setNewBlock] = useState("");

  const { setNodeRef, isOver } = useDroppable({
    id: card._id,
    data: { cardId: card._id },
  });

  const saveTitle = () => {
    setEditingTitle(false);
    if (title !== card.title) {
      onUpdate(card._id, title);
    }
  };

  const createBlock = () => {
    if (!newBlock.trim()) return;
    onCreateBlock(card._id, newBlock);
    setNewBlock("");
  };

  return (
    <div
      ref={setNodeRef}
      className={`
         w-full
        sm:w-77.5
        h-77.5
        overflow-y-scroll
        bg-white rounded-xl shadow p-3
          transition-all
        ${isOver ? "border-2 border-blue-400 scale-[1.03]" : ""}
      `}
    >
      {/* CARD HEADER */}
      <div className="flex justify-between mb-2">
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === "Enter" && saveTitle()}
            className="border rounded px-1 w-full"
          />
        ) : (
          <h3
            onDoubleClick={() => setEditingTitle(true)}
            className="font-medium"
          >
            {card.title}
          </h3>
        )}
        <button onClick={() => onDelete(card._id)} className="text-red-400">
          ✕
        </button>
      </div>

         {/* ADD BLOCK */}
      <input
        value={newBlock}
        onChange={(e) => setNewBlock(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createBlock()}
        placeholder="+ New block"
        className="w-full mb-2 sticky z-40 bg-white top-0 border rounded px-2 py-1 text-sm"
      />

      {/* BLOCKS */}
      <div className="space-y-2 break-all">
        {(card.blocks || []).map((block) => (
          <BlockItem
            key={block._id}
            block={block}
            cardId={card._id}
            onUpdate={onUpdateBlock}
            onDelete={onDeleteBlock}
          />
        ))}
      </div>

   
    </div>
  );
}

/* ---------------- BLOCK ITEM ---------------- */

function BlockItem({ block, cardId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(block.content);

  const elementRef = useRef(null);
  const { highlightedBlock, setHighlightedBlock } = useNotes();

  /* ---------------- DND ---------------- */

  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({
      id: block._id,
      data: {
        blockId: block._id,
        cardId,
        content: block.content,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  /* 🔥 MERGED REF (DnD + scroll/highlight) */
  const setRefs = (node) => {
    elementRef.current = node;
    setNodeRef(node);
  };

  /* ---------------- SYNC VALUE ---------------- */

  useEffect(() => {
    setValue(block.content);
  }, [block.content]);

  /* ---------------- SAVE ---------------- */

  const save = () => {
    setEditing(false);
    if (value !== block.content) {
      onUpdate(block._id, value);
    }
  };

  /* ---------------- AUTO SCROLL + FLASH ---------------- */
  useEffect(() => {
    if (highlightedBlock !== block._id || !elementRef.current) return;
    console.log("Highlight check:", highlightedBlock, block._id);
    // ⏳ Wait for DOM + layout
    requestAnimationFrame(() => {
      setTimeout(() => {
        elementRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Flash highlight
        elementRef.current?.classList.add(
          "ring-2",
          "ring-yellow-400",
          "transition-all",
        );

        const timer = setTimeout(() => {
          elementRef.current?.classList.remove("ring-2", "ring-yellow-400");
          setHighlightedBlock(null);
        }, 1200);

        return () => clearTimeout(timer);
      }, 50); // small delay = reliable
    });
  }, [highlightedBlock, block._id, setHighlightedBlock]);

  /* ---------------- RENDER ---------------- */

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      className="bg-gray-100 rounded p-2 text-sm transition-all"
    >
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setValue(block.content);
              setEditing(false);
            }
          }}
          className="w-full bg-white border rounded px-1"
        />
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          className="flex justify-between items-start gap-2 cursor-text"
        >
          <div className="flex items-start gap-2">
            {/* 🔥 Drag handle */}
            <span
              {...listeners}
              className="cursor-grab text-gray-400 select-none mt-0.5"
              title="Drag"
            >
              ⠿
            </span>

            <span className="wrap-break-word">{linkify(block.content)}</span>
          </div>

          <button
            onClick={() => onDelete(block._id)}
            className="text-red-400 text-xs hover:text-red-600"
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
