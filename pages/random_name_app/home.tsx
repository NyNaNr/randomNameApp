import React, { useState } from "react";
import Head from "next/head";
import ItemCreateButton from "../../components/Chatbar/ItemCreateButton";
import NewListCreator from "../../components/Chatbar/NewListCreator";
import EditListForm from "../../components/EditListForm/EditListForm";

export default function Home() {
  const [lists, setLists] = useState<List[]>([]);
  //ユーザーがクリックした要素のidを共有
  const [selectedListId, setSelectedListId] = useState(null);
  const handleListClick = (id) => {
    setSelectedListId(id);
  };
  //ListTitle
  const [listTitle, setListTitle] = useState("");

  return (
    <React.Fragment>
      <Head>
        <title>とにかく大きい ランダムネーム アプリ</title>
      </Head>

      <div className="flex h-screen">
        <div className="fixed top-0 left-0 z-40 flex h-screen w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all sm:relative sm:top-0 ">
          {/*新規リストを作成するボタン */}
          <ItemCreateButton lists={lists} setLists={setLists} />

          {/*サイドバー */}
          <div className="flex-grow overflow-auto">
            {/*境界線 */}
            <div className="flex border-b border-white/20 ">
              <div className="flex w-full flex-col "></div>
            </div>
            {/*以下新規リスト押したあとにできる要素 */}
            <div className="pt-2">
              <div className="flex w-full flex-col gap-1">
                {/*newListの要素を作成する */}
                <NewListCreator
                  lists={lists}
                  setLists={setLists}
                  onListClick={handleListClick}
                  setSelectedListId={setSelectedListId}
                  setListTitle={setListTitle}
                />
              </div>
            </div>
          </div>

          {/*リストが空の場合ノーデータを表示 */}
          {lists.length === 0 && (
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
          )}
        </div>

        <div className="flex-grow">
          <EditListForm selectedListId={selectedListId} listTitle={listTitle} />
        </div>
      </div>
    </React.Fragment>
  );
}
