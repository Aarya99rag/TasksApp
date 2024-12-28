import React from "react";
import { MdClose } from "react-icons/md";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const TodoInput = ({ type, todoData, onClose, getTodos }) => {
  const [error, setError] = useState("");

  const [todo, setTodo] = useState(todoData?.todo || "");

  const [startTime, setStartTime] = useState(todoData?.expectedStartTime || "");

  const [endTime, setEndTime] = useState(todoData?.expectedEndTime || "");

  const [priority, setPriority] = useState(todoData?.priority || "");

  // add todo api
  const addTodo = async () => {
    try {
      const response = await axiosInstance.post("/todo", {
        todo,
        expectedStartTime: startTime,
        expectedEndTime: endTime,
        priority,
      });
      if (response.data && response.data.newTodo) {
        getTodos();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  // edit todo api
  const onEdit = async (todoData) => {
    const todoId = todoData._id;
    try {
      const response = await axiosInstance.put("/todo/" + todoId, {
        todo,
        expectedStartTime: startTime,
        expectedEndTime: endTime,
        priority,
      });

      if (response.data && response.data.editTodo) {
        getTodos();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddTodo = () => {
    if (!todo || !startTime || !endTime || !priority) {
      setError("Please fill all the fields");
      return;
    }

    setError("");

    if (type === "edit") {
      onEdit(todoData);
    } else {
      addTodo();
    }
  };

  return (
    <div>
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-200"
          onClick={onClose}
        >
          <MdClose className="text-xl text-slate-400" />
        </button>
        <br />

        <div className="flex flex-col gap2">
          <label className="input-label">Todo</label>
          <input
            type="text"
            className="text-sm bg-slate-100 p-2 rounded text-slate-950 outline-none"
            placeholder="Write your todo here"
            value={todo}
            onChange={(event) => setTodo(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Expected Start Time</label>
          <input
            type="text"
            className="text-sm bg-slate-100 p-2 rounded text-slate-950 outline-none"
            placeholder="3pm"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          ></input>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Expected End Time</label>
          <input
            type="text"
            className="text-sm bg-slate-100 p-2 rounded text-slate-950 outline-none"
            placeholder="6pm"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
          ></input>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Priority</label>
          <input
            type="text"
            className="text-sm bg-slate-100 p-2 rounded text-slate-950 outline-none"
            placeholder="ex Urgent, Not Important"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          ></input>
        </div>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <button
          className="btn-primary font-medium mt-3 p-3"
          onClick={handleAddTodo}
        >
          {type === "edit" ? "Edit" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default TodoInput;
