import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl hover:shadow-xl transition-all ease-in-out ml-4">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-sm text-slate-500">
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(date))}
          </span>
        </div>

        <MdOutlinePushPin
          className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`}
          onClick={onPinNote}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2">
        {content?.slice(0, 60) + ". . ."}
      </p>
      {/* ?: Optional chaining, which ensures that if content is null or undefined, it won't throw an error. */}

      <div className="flex items-center justify-between mt-2 mb-4">
        <div className="text-xs text-slate-500">
          {tags.map((tag) => `#${tag} `)}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 relative ">
        <div className="flex items-center gap-2 absolute right-0">
          <p
            onClick={onEdit}
            className="text-xs text-slate-800 cursor-pointer hover:text-purple-600"
          >
            View full note
          </p>
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-500"
            onClick={onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
