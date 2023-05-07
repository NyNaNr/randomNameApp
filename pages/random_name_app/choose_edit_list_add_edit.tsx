import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [lists, setLists] = useState([]);
  const [editMode, setEditMode] = useState("");

  function handleCreateItem() {
    const newList = {
      id: uuidv4(),
      title: "New List",
    };
    setLists((prevLists) => [...prevLists, newList]);
  }

  const handleToggleEditMode = (id) => {
    if (editMode === id) {
      setEditMode("");
    } else {
      setEditMode(id);
    }
  };

  function handleTitleChange(id, newTitle) {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === id ? { ...list, title: newTitle } : list
      )
    );
  }

  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0 ">
        {/*以下新規リスト */}
        <div className="flex items-center">
          <button
            className="text-sidebar flex w-[240px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-white transition-colors duration-200 hover:bg-gray-500/10 "
            onClick={() => {
              handleCreateItem();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="tabler-icon tabler-icon-plus"
            >
              <path d="M12 5l0 14"></path>
              <path d="M5 12l14 0"></path>
            </svg>
            新規リスト
          </button>
        </div>
        {/* サイドバー */}
        <div className="flex-grow overflow-auto">
          {/*境界線 */}
          <div className="flex border-b border-white/20 pb-2">
            <div className="flex w-full flex-col pt-2"></div>
          </div>
          {/* 以下新規リスト押したあとにできる要素 */}
          <div className="pt-2">
            <div className="flex w-full flex-col gap-1">
              {lists.map((list) => (
                <div className="relative flex items-center group" key={list.id}>
                  {editMode === list.id ? (
                    <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm">
                      <input
                        type="text"
                        value={list.title}
                        onChange={(e) =>
                          handleTitleChange(list.id, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") {
                            handleToggleEditMode(list.id);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button
                      className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
                      onClick={() => handleToggleEditMode(list.id)}
                    >
                      {/* 通常のリストアイテムのコンテンツ */}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <div className="edit_list"></div>
        </div>
      </div>
    </div>
  );
}
