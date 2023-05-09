import { useState } from "react";
import ItemCreator from "../../components/Chatbar/ItemCreator";
import NewListCreator from "../../components/Chatbar/NewListCreator";

export default function Home() {
  const [deleteConfirmMode, setDeleteConfirmMode] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [lists, setLists] = useState<List[]>([]);

  //ゴミ箱モードを呼ぶと発動
  const handleToggleDeleteConfirmMode = (id: string) => {
    if (deleteConfirmMode === id) {
      setDeleteConfirmMode(null);
    } else {
      setDeleteConfirmMode(id);
    }
  };
  //ゴミ箱モードでチェックマークを押すと発動
  const handleDeleteList = (id: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== id));
    setDeleteConfirmMode(null);
  };

  //ペンシルアイコン編集モード
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleSaveEdit = () => {
    // ここで名前の変更を確定し、APIなどを呼び出してデータベースを更新します。
    // 例: updateListTitle(list.id, editedTitle);
    setEditMode(false);
  };

  return (
    <div className="flex h-screen">
      <div className="fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0 ">
        {/*以下新規リスト */}
        <ItemCreator lists={lists} setLists={setLists} />

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
              <NewListCreator
                lists={lists}
                setLists={setLists}
                deleteConfirmMode={deleteConfirmMode}
                handleDeleteList={handleDeleteList}
                handleToggleDeleteConfirmMode={handleToggleDeleteConfirmMode}
                handleToggleEditMode={handleToggleEditMode}
              />
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

        {/*リストが空の場合ノーデータを表示 */}
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
