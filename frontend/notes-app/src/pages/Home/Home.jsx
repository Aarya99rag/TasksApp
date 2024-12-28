import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import noteImg from "../../assets/noteImg.avif";
import Todo from "./Todo";

const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const [noteClick, setNotesClick] = useState(true);
  const [todoClick, setTodoClick] = useState(false);

  const onNoteClick = () => {
    setNotesClick(true);
    setTodoClick(false);
  };

  const onTodoClick = () => {
    setTodoClick(true);
    setNotesClick(false);
  };

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isShown: true, type: "edit", data: noteDetails });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Get User Info api
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all notes api
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  // Delete api
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  // Search Notes api
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // pin note api
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.patch("/pin-note/" + noteId, {
        isPinned: !noteData.isPinned,
      });
      if (response.data && response.data.note) {
        showToastMessage("Note Pinned Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  // The useEffect function ensures the getUserInfo function runs only once when the component mounts(everytime when we refresh). It triggers the API call to fetch user data immediately after the component renders, enabling initialization of the user's state.
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    // getTodos();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
        todoClick={todoClick}
        onNoteClick={onNoteClick}
        onTodoClick={onTodoClick}
      />
      {!noteClick && todoClick ? (
        <Todo />
      ) : (
        <>
          <div className="container">
            {allNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 px-4">
                {allNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    title={note.title}
                    date={note.createdOn}
                    content={note.content}
                    tags={note.tags}
                    isPinned={note.isPinned}
                    onEdit={() => handleEdit(note)}
                    onDelete={() => deleteNote(note)}
                    onPinNote={() => updateIsPinned(note)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={noteImg}
                message={
                  isSearch
                    ? `Oops! No notes found matching your search.`
                    : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started!`
                }
              />
            )}
          </div>

          <button
            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
            onClick={() => {
              setOpenAddEditModel({
                isShown: true,
                type: "add",
                data: null,
              });
            }}
          >
            <MdAdd className="text-[32px] text-white" />
          </button>
        </>
      )}

      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            // overlay :  Refers to the background layer that appears over the page when a modal is open. It's the transparent layer that dims the content behind the modal, drawing attention to the modal itself.
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-32 p-5 overflow-hidden"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
