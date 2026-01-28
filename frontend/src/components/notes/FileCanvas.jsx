import { useEffect, useState } from "react";
import API from "../../services/api";
import { useNotes } from "../../context/NotesContext";
import CardColumn from "./canvas/CardColumn";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
export default function FileCanvas() {
  const { activeFile } = useNotes();
  const [cards, setCards] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [activeBlock, setActiveBlock] = useState(null);
  // 🔥 Always fetch cards from backend
  useEffect(() => {
    if (!activeFile) return;

    Promise.all([
      API.get(`/notes/cards/${activeFile}`),
      API.get(`/notes/blocks/all`),
    ]).then(([cardsRes, blocksRes]) => {
      const blocksByCard = {};
      blocksRes.data.forEach((b) => {
        if (!blocksByCard[b.cardId]) blocksByCard[b.cardId] = [];
        blocksByCard[b.cardId].push(b);
      });

      const enriched = cardsRes.data.map((card) => ({
        ...card,
        blocks: (blocksByCard[card._id] || []).sort(
          (a, b) => a.order - b.order
        ),
      }));

      setCards(enriched);
    });
  }, [activeFile]);

  const createCard = async () => {
    if (!newTitle.trim()) return;

    const res = await API.post("/notes/cards", {
      fileId: activeFile,
      title: newTitle,
      order: cards.length,
    });

    setCards([...cards, res.data]);
    setNewTitle("");
  };

  const deleteCard = async (id) => {
    await API.delete(`/notes/cards/${id}`);
    setCards(cards.filter((c) => c._id !== id));
  };

  const updateCard = async (id, title) => {
    const res = await API.patch(`/notes/cards/${id}`, { title });
    setCards(cards.map((c) => (c._id === id ? res.data : c)));
  };

  if (!activeFile) {
    return (
      <div className="flex-1 p-6 text-gray-400">
        Select a file to start writing notes
      </div>
    );
  }

  const createBlock = async (cardId, content) => {
    const res = await API.post("/notes/blocks", {
      cardId,
      content,
      order: cards.find((c) => c._id === cardId)?.blocks.length || 0,
    });

    setCards((prev) =>
      prev.map((card) =>
        card._id === cardId
          ? { ...card, blocks: [...card.blocks, res.data] }
          : card
      )
    );
  };

  const updateBlock = async (blockId, content) => {
    const res = await API.patch(`/notes/blocks/${blockId}`, { content });

    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        blocks: (card.blocks || []).map((b) =>
          b._id === blockId ? res.data : b
        ),
      }))
    );
  };

  const deleteBlock = async (blockId) => {
    await API.delete(`/notes/blocks/${blockId}`);

    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        blocks: card.blocks.filter((b) => b._id !== blockId),
      }))
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active.data.current) return;

    const { blockId, cardId: fromCardId } = active.data.current;
    const toCardId = over.data?.current?.cardId;

    // 🚫 Dropped outside a card
    if (!toCardId) return;

    // 🔁 Same card → do nothing for now
    if (fromCardId === toCardId) return;

    setCards((prevCards) => {
      // 🔥 IMMUTABLE UPDATE (functional form)
      const newCards = prevCards.map((card) => ({
        ...card,
        blocks: [...card.blocks],
      }));

      const sourceCard = newCards.find((c) => c._id === fromCardId);
      const targetCard = newCards.find((c) => c._id === toCardId);

      if (!sourceCard || !targetCard) return prevCards;

      const blockIndex = sourceCard.blocks.findIndex((b) => b._id === blockId);

      if (blockIndex === -1) return prevCards;

      // 🔀 MOVE BLOCK
      const [movedBlock] = sourceCard.blocks.splice(blockIndex, 1);
      movedBlock.cardId = toCardId;
      targetCard.blocks.push(movedBlock);

      // 🔥 BACKEND SYNC (fire & forget)
      newCards.forEach((card) => {
        card.blocks.forEach((b, i) => {
          API.patch(`/notes/blocks/${b._id}`, {
            cardId: card._id,
            order: i,
          });
        });
      });

      // ✅ RETURN NEW STATE → RE-RENDER
      return newCards;
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={(e) => {
        setActiveBlock(e.active.data.current);
      }}
      onDragEnd={(e) => {
        handleDragEnd(e);
        setActiveBlock(null);
      }}
      onDragCancel={() => setActiveBlock(null)}
    >
      <div className="flex-1 p-3 sm:p-4 overflow-x-auto  overflow-y-hidden">
        <div className="flex lg:grid lg:grid-cols-3 flex-col sm:flex-row gap-4">
           {/* Add card */}
          <div className="w-full sm:w-64 bg-white rounded-xl  shadow p-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCard()}
              placeholder="+ New card"
              className="w-full border rounded px-2 py-1"
            />
          </div>
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

         
        </div>
      </div>
      <DragOverlay>
        {activeBlock ? (
          <div className="bg-gray-200 rounded p-2 shadow-lg scale-105">
            {activeBlock.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
