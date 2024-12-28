import React from "react";
import { FcCheckmark } from "react-icons/fc";
import { MdCreate } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

const TodoCard = ({
  todo,
  date,
  startTime,
  endTime,
  markAsDone,
  priority,
  handleEdit,
  handleDelete,
  handleMarkDone,
}) => {
  return (
    <div className="flex justify-center">
      <div
        className={`flex flex-col sm:flex-row items-start gap-5 mt-6 border rounded-xl p-3 shadow-md transition-all ease-in-out bg-white ${
          markAsDone
            ? "shadow-green-500"
            : "shadow-red-300"
        }`}
      >
        <div className="flex gap-5">
          <span className="text-md text-slate-700 font-bold align-middle">
            {todo}
          </span>
          <span className="text-sm text-slate-500 align-middle">
            {new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(date))}
          </span>
        </div>

        <div className="flex gap-5">
          <span className="text-xs text-slate-500 align-middle">
            Expected duration :
            <br />
            {` ${startTime}-${endTime}`}
          </span>
          <span className="text-xs text-slate-500 align-middle">
            Priority :
            <br />
            {priority}
          </span>
        </div>

        <div className="flex items-center gap-5">
          <button className="align-middle" onClick={handleDelete}>
            <FaTrashAlt className="text-red-500 text-xl" />
          </button>

          <button className="align-middle" onClick={handleEdit}>
            <MdCreate className="text-blue-900 text-2xl" />
          </button>

          <button className="align-middle" onClick={handleMarkDone}>
            {markAsDone ? (
              <FcCheckmark className="text-3xl" />
            ) : (
              <FaTimes className="text-2xl text-red-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
