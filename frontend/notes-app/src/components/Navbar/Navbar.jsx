import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({
  userInfo,
  onSearchNote,
  handleClearSearch,
  onNoteClick,
  onTodoClick,
  todoClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    // localStorage.clear(): Removes all items from localStorage.
    // localStorage.removeItem(key): Removes a specific item by its key.
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-gradient-to-r from-[#03018b] via-[#03018b] to-[#000000] flex items-center justify-between px-6 py-2 drop-shadow">
      <div className="flex items-center gap-8">
        <button
          onClick={onNoteClick}
          className="text-xl text-white hover:underline"
        >
          Notes
        </button>

        <button
          onClick={onTodoClick}
          className="text-white text-xl hover:underline"
        >
          Todo
        </button>
      </div>

      {!todoClick && (
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      )}

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
