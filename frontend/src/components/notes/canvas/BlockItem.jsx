import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { debounce } from "../../../utils/debounce";
import API from "../../../services/api";

const syncBlock = debounce((id, data) => {
  API.patch(`/notes/blocks/${id}`, data);
});

export default function BlockItem({ block }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(block.content);

  const save = () => {
    setIsEditing(false);
    if (value !== block.content) {
      syncBlock(block._id, { content: value });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        bg-gray-100 rounded p-2 text-sm
        cursor-grab hover:bg-gray-200
      "
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setValue(block.content);
              setIsEditing(false);
            }
          }}
          className="w-full bg-white border rounded px-1"
        />
      ) : (
        value
      )}
      {/* <button
  onClick={(e) => {
    e.stopPropagation();
    API.delete(`/notes/blocks/${block._id}`);
  }}
  className="text-xs text-red-400 float-right"
>
  ✕
</button> */}

    </div>
  );
}
