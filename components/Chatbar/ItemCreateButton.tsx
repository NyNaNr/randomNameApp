import { v4 as uuidv4 } from "uuid";

//新規リスト作成
const ItemCreateButton = ({ lists, setLists }) => {
  //新規リスト作成

  const handleCreateItem = () => {
    const newList = {
      id: uuidv4(),
      title: "New List",
    };
    //updater 関数
    setLists((prevLists) => [...prevLists, newList]);

    // Update local storage
    const existingListsItem = window.localStorage.getItem("listNames");
    const parsedLists = existingListsItem
      ? JSON.parse(existingListsItem)
      : null;
    const existingLists = Array.isArray(parsedLists) ? parsedLists : [];
    const updatedLists = [...existingLists, newList];
    window.localStorage.setItem("listNames", JSON.stringify(updatedLists));
  };

  return (
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
  );
};

export default ItemCreateButton;
