import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [lists, setLists] = useState([]);
  const [deleteConfirmMode, setDeleteConfirmMode] = useState(null);
  const [editMode, setEditMode] = useState(null);

  function handleCreateItem() {
    const newList = {
      id: uuidv4(),
      title: "New List",
    };
    setLists((prevLists) => [...prevLists, newList]);
  }

  function handleDeleteList(id) {
    setLists((prevLists) => prevLists.filter((list) => list.id !== id));
    setDeleteConfirmMode(null);
  }

  function handleToggleDeleteConfirmMode(id) {
    if (deleteConfirmMode === id) {
      setDeleteConfirmMode(null);
    } else {
      setDeleteConfirmMode(id);
    }
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
        {/*サイドバー */}
        <div className="flex-grow overflow-auto">
          {/*境界線 */}
          <div className="flex border-b border-white/20 pb-2">
            <div className="flex w-full flex-col pt-2"></div>
          </div>
          {/*以下新規リスト押したあとにできる要素 */}
          <div className="pt-2">
            <div className="flex w-full flex-col gap-1">
              {/*一番初めのnewConversation */}
              {lists.map((list) => (
                <div className="relative flex items-center group" key={list.id}>
                  <button
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
                    draggable="true"
                  >
                    {/*リストアイコン */}
                    <svg
                      fill="none"
                      stroke="white"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                      />
                    </svg>
                    <div className="text-white relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 pr-12">
                      {list.title}
                    </div>
                  </button>
                  <div className="absolute right-1 z-10 flex text-gray-300 opacity-0 group-hover:opacity-100"></div>
                  {deleteConfirmMode === list.id ? (
                    <div className="absolute right-1 z-10 flex text-gray-300">
                      {/* Checkmark button */}
                      <button
                        className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                        onClick={() => handleDeleteList(list.id)}
                      >
                        {/* Checkmark icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="tabler-icon tabler-icon-check"
                        >
                          <path d="M5 12l5 5l10 -10"></path>
                        </svg>
                      </button>

                      {/* Cross button */}
                      <button
                        className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                        onClick={() => handleToggleDeleteConfirmMode(list.id)}
                      >
                        {/* Cross icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="tabler-icon tabler-icon-x"
                        >
                          <path d="M18 6l-12 12"></path>
                          <path d="M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="absolute right-1 z-10 flex text-gray-300 opacity-0 group-hover:opacity-100">
                      {/* Pencil button */}
                      <button className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="tabler-icon tabler-icon-pencil"
                        >
                          <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                          <path d="M13.5 6.5l4 4"></path>
                        </svg>
                      </button>

                      {/* Trash button */}
                      <button
                        className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                        onClick={() => handleToggleDeleteConfirmMode(list.id)}
                      >
                        <button className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="tabler-icon tabler-icon-trash"
                          >
                            <path d="M4 7l16 0"></path>
                            <path d="M10 11l0 6"></path>
                            <path d="M14 11l0 6"></path>
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                          </svg>
                        </button>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {/*二番目のnewConversation */}
              <div className="relative flex items-center">
                <button
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90  "
                  draggable="true"
                >
                  <svg
                    fill="none"
                    stroke="white"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                    />
                  </svg>
                  <div className="text-white relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 pr-1">
                    New Conversation
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-auto">
          <div className="mt-8 select-none text-center text-white opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="mx-auto mb-3"
            >
              <path d="M12 5h9"></path>
              <path d="M3 10h7"></path>
              <path d="M18 10h1"></path>
              <path d="M5 15h5"></path>
              <path d="M14 15h1m4 0h2"></path>
              <path d="M3 20h9m4 0h3"></path>
              <path d="M3 3l18 18"></path>
            </svg>
            <span className="text-[14px] leading-normal">No data.</span>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="edit_list"></div>
      </div>
    </div>
  );
}
