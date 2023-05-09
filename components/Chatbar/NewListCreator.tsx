import DeleteListFunction from "./ButtonFunction/DeleteListFunction";
import RenameListFunction from "./ButtonFunction/RenameListFunction";

//新規リスト作成
const NewListCreator = ({ lists, setLists, handleToggleEditMode }) => {
  //edit_in_place移植

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
          <DeleteListFunction
            listId={list.id}
            handleToggleEditMode={handleToggleEditMode}
            setLists={setLists}
          />
          {/* <RenameListFunction /> */}
        </div>
      ))}
    </div>
  );
};

export default NewListCreator;
