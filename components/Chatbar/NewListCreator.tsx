import { v4 as uuidv4 } from "uuid";

//新規リスト作成
const NewListCreator = ({
  lists,
  setLists,
  deleteConfirmMode,
  handleDeleteList,
  handleToggleDeleteConfirmMode,
  handleToggleEditMode,
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
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

          {/*表示アイコンの分岐処理 */}
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
              <button
                className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                onClick={handleToggleEditMode}
              >
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
    </div>
  );
};

export default NewListCreator;
