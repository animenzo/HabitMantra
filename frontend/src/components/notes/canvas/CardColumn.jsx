import { useEffect, useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { useNotes } from "../../../context/NotesContext";
import { linkify } from "../../../utils/linkify";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiGrid,
} from "react-icons/fi";

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
  const [isAddingBlock, setIsAddingBlock] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: card._id,
    data: { cardId: card._id },
  });

  const saveTitle = () => {
    setEditingTitle(false);
    if (title.trim() && title !== card.title) {
      onUpdate(card._id, title.trim());
    } else {
      setTitle(card.title);
    }
  };

  const createBlock = () => {
    if (!newBlock.trim()) return;
    onCreateBlock(card._id, newBlock.trim());
    setNewBlock("");
    setIsAddingBlock(false);
  };

  const blocks = card.blocks || [];

  return (
    <div
      ref={setNodeRef}
      className={`
        w-72 sm:w-80 shrink-0
        max-h-[calc(100vh-170px)]
        flex flex-col
        bg-slate-100/75 border border-slate-200/90 rounded-2xl p-3.5 shadow-xs
        transition-all duration-200
        ${isOver ? "border-indigo-400 ring-2 ring-indigo-100 bg-indigo-50/30" : ""}
      `}
    >
      {/* COLUMN HEADER */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70">
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
          {editingTitle ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTitle();
                if (e.key === "Escape") {
                  setTitle(card.title);
                  setEditingTitle(false);
                }
              }}
              className="bg-white border border-indigo-400 rounded-lg px-2 py-0.5 text-xs text-slate-900 outline-none font-bold w-full"
            />
          ) : (
            <h3
              onDoubleClick={() => setEditingTitle(true)}
              className="font-bold text-xs text-slate-900 truncate tracking-tight cursor-pointer hover:text-indigo-600 transition-colors"
              title="Double-click to rename"
            >
              {card.title}
            </h3>
          )}
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-600">
            {blocks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setEditingTitle(true)}
            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-200/70 transition-colors"
            title="Rename column"
          >
            <FiEdit2 size={12} />
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete list "${card.title}" and all its items?`)) {
                onDelete(card._id);
              }
            }}
            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Delete list"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>

      {/* BLOCKS LIST */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[60px]">
        {blocks.map((block) => (
          <BlockItem
            key={block._id}
            block={block}
            cardId={card._id}
            onUpdate={onUpdateBlock}
            onDelete={onDeleteBlock}
          />
        ))}

        {blocks.length === 0 && !isAddingBlock && (
          <div className="py-6 text-center text-xs text-slate-400 font-medium">
            No notes here yet
          </div>
        )}
      </div>

      {/* ADD BLOCK INPUT / BUTTON */}
      <div className="pt-2 mt-2 border-t border-slate-200/70">
        {isAddingBlock ? (
          <div className="space-y-1.5 bg-white p-2 rounded-xl border border-indigo-200 shadow-2xs">
            <textarea
              autoFocus
              rows={2}
              value={newBlock}
              onChange={(e) => setNewBlock(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  createBlock();
                }
                if (e.key === "Escape") {
                  setIsAddingBlock(false);
                }
              }}
              placeholder="Type note item (links auto-detect)..."
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none resize-none bg-transparent"
            />
            <div className="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingBlock(false)}
                className="px-2 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createBlock}
                disabled={!newBlock.trim()}
                className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-40 transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingBlock(true)}
            className="flex items-center gap-1.5 w-full py-1.5 px-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all"
          >
            <FiPlus size={14} />
            <span>Add note</span>
          </button>
        )}
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

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
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
    opacity: isDragging ? 0.4 : 1,
  };

  const setRefs = (node) => {
    elementRef.current = node;
    setNodeRef(node);
  };

  useEffect(() => {
    setValue(block.content);
  }, [block.content]);

  const save = () => {
    setEditing(false);
    if (value.trim() && value !== block.content) {
      onUpdate(block._id, value.trim());
    } else {
      setValue(block.content);
    }
  };

  /* AUTO SCROLL & HIGHLIGHT FLASH FROM SEARCH */
  useEffect(() => {
    if (highlightedBlock !== block._id || !elementRef.current) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        elementRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        elementRef.current?.classList.add(
          "ring-2",
          "ring-indigo-500",
          "bg-indigo-50/60"
        );

        const timer = setTimeout(() => {
          elementRef.current?.classList.remove(
            "ring-2",
            "ring-indigo-500",
            "bg-indigo-50/60"
          );
          setHighlightedBlock(null);
        }, 1500);

        return () => clearTimeout(timer);
      }, 50);
    });
  }, [highlightedBlock, block._id, setHighlightedBlock]);

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-2xs hover:border-slate-300 transition-all text-xs text-slate-800 group"
    >
      {editing ? (
        <textarea
          autoFocus
          rows={2}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") {
              setValue(block.content);
              setEditing(false);
            }
          }}
          className="w-full bg-slate-50 border border-indigo-400 rounded-lg p-1.5 text-xs text-slate-900 outline-none resize-none font-medium"
        />
      ) : (
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            {/* Drag Handle */}
            <span
              {...listeners}
              className="cursor-grab text-slate-300 hover:text-slate-600 select-none mt-0.5 shrink-0"
              title="Drag note to reorder"
            >
              <FiGrid size={12} />
            </span>

            {/* Note Content */}
            <div
              onDoubleClick={() => setEditing(true)}
              className="break-words flex-1 cursor-text leading-relaxed font-medium"
            >
              {linkify(block.content)}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(block._id)}
            className="text-slate-300 hover:text-red-500 p-0.5 rounded opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0"
            title="Delete item"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
