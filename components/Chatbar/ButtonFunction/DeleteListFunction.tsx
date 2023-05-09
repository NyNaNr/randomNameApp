import React from "react";
import { useState } from "react";

interface DeleteListFunctionProps {
  listId: string;
  handleToggleEditMode: () => void;
  setLists: (callback: (prevLists: any[]) => any[]) => void;
}

const DeleteListFunction: React.FC<DeleteListFunctionProps> = ({
  listId,
  handleToggleEditMode,
  setLists,
}) => {
  const [deleteConfirmMode, setDeleteConfirmMode] = useState(null);
  //ゴミ箱モードを呼ぶと発動
  const handleToggleDeleteConfirmMode = (id) => {
    if (deleteConfirmMode === id) {
      setDeleteConfirmMode(null);
    } else {
      setDeleteConfirmMode(id);
    }
  };

  //ゴミ箱モードでチェックマークを押すと発動
  const handleDeleteList = (id) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== id));
    setDeleteConfirmMode(null);
  };
  return deleteConfirmMode === listId ? (
    <div className="absolute right-1 z-10 flex text-gray-300">
      {/* Checkmark button */}
      <button
        className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
        onClick={() => handleDeleteList(listId)}
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
        onClick={() => handleToggleDeleteConfirmMode(listId)}
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
      <button
        className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
        onClick={handleToggleEditMode}
      >
        {/* Pencil icon */}
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
        onClick={() => handleToggleDeleteConfirmMode(listId)}
      >
        {/* Trash icon */}
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
    </div>
  );
};

export default DeleteListFunction;
