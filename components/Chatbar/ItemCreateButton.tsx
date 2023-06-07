import { v4 as uuidv4 } from "uuid";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import Cookies from "js-cookie";

type ListType = {
  id: string;
  title: string;
};

type ItemCreateButtonProps = {
  lists: ListType[];
  setLists: Dispatch<SetStateAction<ListType[]>>;
  setSelectedListId: React.Dispatch<React.SetStateAction<string | null>>;
};

//新規リスト作成
const ItemCreateButton: React.FC<ItemCreateButtonProps> = ({
  lists,
  setLists,
  setSelectedListId,
}) => {
  //新規リスト作成

  const handleCreateItem = () => {
    if (lists.length >= 40) {
      //cookieは１ドメイン当たり上限がある。ブラウザによって異なるが低いもので50だったから、余裕をもって40
      return;
    }
    const newList = {
      id: uuidv4(),
      title: "New List",
    };
    setSelectedListId(newList.id);
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

  //初回アクセス時のみSampleを追加する
  useEffect(() => {
    const existingListsItem = window.localStorage.getItem("listNames");

    if (existingListsItem === null) {
      const newList = {
        id: "Sample01-0825-42e8-b928-cbd8",
        title: "Sample_偉人",
      };
      //updater 関数
      setLists((prevLists) => [...prevLists, newList]);

      const updatedLists = [newList];
      window.localStorage.setItem("listNames", JSON.stringify(updatedLists));

      //cookieもセット
      const izin = [
        "聖徳　太子",
        "源 義経",
        "源頼朝",
        "",
        "北条　時宗",
        "後醍醐天皇",
        "足利　尊氏",
        "織田　信長",
        "豊臣秀吉",
        "",
        "徳川 家康",
        "伊達政宗",
        "上杉謙信",
        "坂本龍馬",
        "西郷隆盛",
        "伊藤博文",
        "野口英世",
      ];
      Cookies.set("Sample01-0825-42e8-b928-cbd8", JSON.stringify(izin), {
        expires: 365,
      });
    }
  }, [setLists]);

  return (
    <React.Fragment>
      <div className="flex items-center">
        <button
          className={`text-sidebar flex w-[240px] flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 pl-3 py-2 text-white transition-colors duration-200 ${
            lists.length >= 40
              ? "bg-gray-500/50 cursor-not-allowed justify-center"
              : "hover:bg-gray-500/10"
          }`}
          onClick={handleCreateItem}
          disabled={lists.length >= 40}
        >
          {lists.length >= 40 ? (
            ""
          ) : (
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
          )}

          {lists.length >= 40 ? "リスト作成数が上限に達しました" : "新規リスト"}
        </button>
      </div>
    </React.Fragment>
  );
};

export default ItemCreateButton;
