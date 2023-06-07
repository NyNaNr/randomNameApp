import React, { useState, useEffect } from "react";
import Head from "next/head";
import ItemCreateButton from "../../components/Chatbar/ItemCreateButton";
import NewListCreator from "../../components/Chatbar/NewListCreator";
import EditListForm from "../../components/EditListForm/EditListForm";
import { isMobile } from "../../utils/random_name_app";
import {
  CloseSidebarButton,
  OpenSidebarButton,
} from "../../components/Chatbar/OpenCloseButton";
import { useRouter } from "next/router";

type ListType = {
  id: string;
  title: string;
};

export default function Home() {
  const router = useRouter();
  const currentUrl = `https://yur.vercel.app${router.asPath}`;
  const [lists, setLists] = useState<ListType[]>([]);
  //ユーザーがクリックした要素のidを共有
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const handleListClick = (id: string) => {
    setSelectedListId(id);
  };
  //ListTitle
  const [listTitle, setListTitle] = useState<string | null>("");

  //リストカウント
  const listCount = "リストの数: " + String(lists.length) + "/40";

  //サイドバー
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const [isWideScreen, setIsWideScreen] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setIsWideScreen(window.innerWidth >= 640);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isWideScreen) {
      setIsOpen(true);
    }
  }, [isWideScreen]);

  return (
    <React.Fragment>
      <Head>
        <title>Home - とにかく大きい ランダムネーム アプリ</title>
        <meta
          name="description"
          content="ビンゴのように名前をランダムに大きく表示するWebアプリです。入力した名前は外部サーバーに送信されず、ローカルに保存されます。"
        />
        <meta property="og:url" content={currentUrl} />
      </Head>

      <div className={`flex`}>
        {isOpen ? (
          <div
            className={`${
              isOpen ? "z-30 " : ""
            } sidebar fixed top-0 left-0 z-60 flex h-screen w-[260px] flex-none flex-col space-y-2 bg-[#202123] p-2 text-[14px] transition-all  sm:min-h-screen`}
          >
            {/*新規リストを作成するボタン */}
            <ItemCreateButton
              lists={lists}
              setLists={setLists}
              setSelectedListId={setSelectedListId}
            />
            <div className="underNewButton flex justify-between">
              <button
                className=" flex flex-grow mr-2 cursor-pointer select-none items-center gap-3 rounded-md border pl-0.5 py-2 border-white/20 text-white transition-colors duration-200 hover:bg-gray-500/10"
                onClick={() => setSelectedListId(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-home ml-2.5"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
                ホーム画面
              </button>
              <div className="show-list-count text-white text-right pr-2 py-2 ">
                {listCount}
              </div>
            </div>
            {/*境界線 */}
            <div className="flex border-b border-white/20 "></div>
            {/*サイドバー */}
            <div className="flex-grow overflow-auto">
              {/*以下新規リスト押したあとにできる要素 */}
              <div className="pt-2">
                <div
                  className={`${
                    isMobile() ? " pb-24" : ""
                  } flex flex-col gap-1`}
                >
                  {/*newListの要素を作成する */}
                  <NewListCreator
                    lists={lists}
                    setLists={setLists}
                    onListClick={handleListClick}
                    setSelectedListId={setSelectedListId}
                    selectedListId={selectedListId}
                    setListTitle={setListTitle}
                  />
                </div>
              </div>
            </div>

            {/*リストが空の場合ノーデータを表示 */}
            {lists.length === 0 && (
              <div className="flex-grow ">
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
            {!isWideScreen && <CloseSidebarButton onClick={toggleOpen} />}
          </div>
        ) : (
          <OpenSidebarButton onClick={toggleOpen} />
        )}

        <div
          className={`flex-grow sm:ml-[260px]`}
          style={{
            minHeight: "100dvh",
          }}
        >
          <EditListForm
            selectedListId={selectedListId}
            listTitle={listTitle}
            isOpen={isOpen}
            toggleOpen={toggleOpen}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
