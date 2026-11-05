import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNotes } from "../../context/NotesContext";
import CardColumn from "./canvas/CardColumn";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { FiPlus, FiFileText, FiFolder, FiCheck, FiX, FiLayers } from "react-icons/fi";

export default function FileCanvas() {
  const { activeFile, activeFolder, folders } = useNotes();
  const [cards, setCards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeFile) {
      setCards([]);
      return;
    }

    setLoading(true);
    Promise.all([
      API.get(`/notes/cards/${activeFile}`),
      API.get(`/notes/blocks/all`),
    ])
      .then(([cardsRes, blocksRes]) => {
        const blocksByCard = {};
        (blocksRes.data || []).forEach((b) => {
          if (!blocksByCard[b.cardId]) blocksByCard[b.cardId] = [];
          blocksByCard[b.cardId].push(b);
        });

        const enriched = (cardsRes.data || []).map((card) => ({
          ...card,
          blocks: (blocksByCard[card._id] || []).sort(
            (a, b) => a.order - b.order
          ),
        }));

        setCards(enriched);
      })
      .catch((err) => console.error("Failed to load cards & blocks", err))
      .finally(() => setLoading(false));
  }, [activeFile]);

  const createCard = async () => {
    if (!newTitle.trim()) return;

    try {
      const res = await API.post("/notes/cards", {
        fileId: activeFile,
        title: newTitle.trim(),
        order: cards.length,
      });

      setCards([...cards, { ...res.data, blocks: [] }]);
      setNewTitle("");
      setIsAddingCard(false);
    } catch (err) {
      console.error("Failed to create card", err);
    }
  };

  const deleteCard = async (id) => {
    try {
      await API.delete(`/notes/cards/${id}`);
      setCards(cards.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete card", err);
    }
  };

  const updateCard = async (id, title) => {
    try {
      const res = await API.patch(`/notes/cards/${id}`, { title });
      setCards(cards.map((c) => (c._id === id ? { ...c, title: res.data.title } : c)));
    } catch (err) {
      console.error("Failed to update card", err);
    }
  };

  const createBlock = async (cardId, content) => {
    try {
      const currentCard = cards.find((c) => c._id === cardId);
      const res = await API.post("/notes/blocks", {
        cardId,
        content,
        order: currentCard?.blocks?.length || 0,
      });

      setCards((prev) =>
        prev.map((card) =>
          card._id === cardId
            ? { ...card, blocks: [...(card.blocks || []), res.data] }
            : card
        )
      );
    } catch (err) {
      console.error("Failed to create block", err);
    }
  };

  const updateBlock = async (blockId, content) => {
    try {
      const res = await API.patch(`/notes/blocks/${blockId}`, { content });

      setCards((prev) =>
        prev.map((card) => ({
          ...card,
          blocks: (card.blocks || []).map((b) =>
            b._id === blockId ? res.data : b
          ),
        }))
      );
    } catch (err) {
      console.error("Failed to update block", err);
    }
  };

  const deleteBlock = async (blockId) => {
    try {
      await API.delete(`/notes/blocks/${blockId}`);

      setCards((prev) =>
        prev.map((card) => ({
          ...card,
          blocks: (card.blocks || []).filter((b) => b._id !== blockId),
        }))
      );
    } catch (err) {
      console.error("Failed to delete block", err);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active.data.current) return;

    const { blockId, cardId: fromCardId } = active.data.current;
    const toCardId = over.data?.current?.cardId;

    if (!toCardId || fromCardId === toCardId) return;

    setCards((prevCards) => {
      const newCards = prevCards.map((card) => ({
        ...card,
        blocks: [...(card.blocks || [])],
      }));

      const sourceCard = newCards.find((c) => c._id === fromCardId);
      const targetCard = newCards.find((c) => c._id === toCardId);

      if (!sourceCard || !targetCard) return prevCards;

      const blockIndex = sourceCard.blocks.findIndex((b) => b._id === blockId);
      if (blockIndex === -1) return prevCards;

      const [movedBlock] = sourceCard.blocks.splice(blockIndex, 1);
      movedBlock.cardId = toCardId;
      targetCard.blocks.push(movedBlock);

      // Backend sync
      newCards.forEach((card) => {
        card.blocks.forEach((b, i) => {
          API.patch(`/notes/blocks/${b._id}`, {
            cardId: card._id,
            order: i,
          });
        });
      });

      return newCards;
    });
  };

  // Find active folder name
  const currentFolderName = folders.find((f) => f._id === activeFolder)?.name;

  if (!activeFile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/40">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
          <FiFileText size={26} />
        </div>
        <h3 className="text-base font-bold text-slate-800">No note file selected</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm leading-normal">
          Select an existing file from the sidebar explorer or create a new folder and file to start organizing your thoughts.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveBlock(e.active.data.current)}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setActiveBlock(null);
      }}
      onDragCancel={() => setActiveBlock(null)}
    >
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/40">
        {/* Canvas Header / Breadcrumb Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {currentFolderName && (
              <>
                <span className="flex items-center gap-1 text-slate-600">
                  <FiFolder size={13} className="text-indigo-500" />
                  {currentFolderName}
                </span>
                <span className="text-slate-300">/</span>
              </>
            )}
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <FiFileText size={14} className="text-indigo-600" />
              Notes Board
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[11px] font-semibold text-slate-500">
              {cards.length} {cards.length === 1 ? "column" : "columns"}
            </span>
          </div>

          <button
            onClick={() => setIsAddingCard(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 text-xs font-semibold transition-colors"
          >
            <FiPlus size={14} />
            <span>Add List</span>
          </button>
        </div>

        {/* Board Horizontal Workspace */}
        <div className="flex-1 p-4 sm:p-6 overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="flex items-start gap-4 h-full">
            {cards.map((card) => (
              <CardColumn
                key={card._id}
                card={card}
                onDelete={deleteCard}
                onUpdate={updateCard}
                onCreateBlock={createBlock}
                onUpdateBlock={updateBlock}
                onDeleteBlock={deleteBlock}
              />
            ))}

            {/* Add Column Box */}
            <div className="w-72 sm:w-80 shrink-0">
              {isAddingCard ? (
                <div className="bg-white border border-indigo-300 rounded-2xl p-3.5 shadow-sm space-y-2">
                  <input
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") createCard();
                      if (e.key === "Escape") setIsAddingCard(false);
                    }}
                    placeholder="Enter list title (e.g. Ideas, Tasks)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-400"
                  />
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setIsAddingCard(false)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createCard}
                      disabled={!newTitle.trim()}
                      className="px-3 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-40 transition-colors shadow-xs"
                    >
                      Add List
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingCard(true)}
                  className="w-full py-3.5 px-4 rounded-2xl border border-dashed border-slate-300 hover:border-indigo-400 bg-white/60 hover:bg-white text-slate-600 hover:text-indigo-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <FiPlus size={16} />
                  <span>Add another list</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeBlock ? (
          <div className="bg-white border border-indigo-400 rounded-xl p-3 shadow-xl scale-105 opacity-95 text-xs font-medium text-slate-900 max-w-xs">
            {activeBlock.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
