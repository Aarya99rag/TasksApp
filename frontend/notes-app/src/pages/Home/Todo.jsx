import { MdAdd } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TodoInput from "../../components/Input/TodoInput";
import TodoCard from "../../components/Cards/TodoCard";
import axiosInstance from "../../utils/axiosInstance";

const Todo = () => {
  const [todoModalState, setTodoModalState] = useState({
    isShown: false,
    data: null,
    type: "add",
  });

  const handleEdit = (todo) => {
    setTodoModalState({
      isShown: true,
      data: todo,
      type: "edit",
    });
  };

  const [allTodos, setAllTodos] = useState([]);

  // get todos api
  const getTodos = async () => {
    try {
      const response = await axiosInstance.get("/todo");
      if (response.data && response.data.todo) {
        setAllTodos(response.data.todo);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  // delete todo api
  const handleDelete = async (todo) => {
    const todoId = todo._id;
    try {
      const response = await axiosInstance.delete("/todo/" + todoId);
      if (response.data && response.data.dTodo) {
        getTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // mark as done api
  const handleMarkDone = async (todo) => {
    const todoId = todo._id;
    try {
      const response = await axiosInstance.patch("/todo/" + todoId, {
        markAsDone: !todo.markAsDone,
      });
      if (response.data && response.data.markTodo) {
        getTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div>
      <div className="mt-6">
        {allTodos.map((todo) => (
          <TodoCard
            key={todo._id}
            todo={todo.todo}
            date={todo.dateOfCreation}
            startTime={todo.expectedStartTime}
            endTime={todo.expectedEndTime}
            markAsDone={todo.markAsDone}
            priority={todo.priority}
            handleEdit={() => handleEdit(todo)}
            handleDelete={() => handleDelete(todo)}
            handleMarkDone={() => handleMarkDone(todo)}
          />
        ))}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setTodoModalState({
            isShown: true,
            data: null,
            type: "add",
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={todoModalState.isShown}
        onRequestClose={() => {
          setTodoModalState({
            isShown: false,
            data: null,
            type: "add",
          });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        className="w-[40%] max-h-3/4 mt-32 bg-white rounded-md mx-auto p-5"
      >
        <TodoInput
          type={todoModalState.type}
          todoData={todoModalState.data}
          onClose={() => {
            setTodoModalState({
              isShown: false,
              data: null,
              type: "add",
            });
          }}
          getTodos={getTodos}
        />
      </Modal>
    </div>
  );
};

export default Todo;
