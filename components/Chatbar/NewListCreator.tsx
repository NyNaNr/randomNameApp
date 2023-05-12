import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { fetchListsFromLocalStorage } from "../../utils/random_name_app";

//TODO:削除したとき、名前を変更したときに、ローカルストレージを書き換える。

//新規リスト作成
const NewListCreator = ({ lists, setLists, onListClick }) => {
  useEffect(() => {
    const listsFromLocalStorage = fetchListsFromLocalStorage();
    console.log("listsFromLocalStorage", listsFromLocalStorage);
    setLists(listsFromLocalStorage);
  }, []);
  //ゴミ箱
  const [deleteConfirmMode, setDeleteConfirmMode] = useState(null);
  //その場編集
  const prevListsRef = useRef();
  //useEffectフックを使用して、listsが更新された時点でorigListNamesおよびnewListNamesを設定する
  //useEffect内で前回のlistsと現在のlistsを比較して新規に追加されたリストを特定し、それらのリスト名だけを更新するようにする
  useEffect(() => {
    if (prevListsRef.current) {
      const newLists = lists.filter(
        (list) => !prevListsRef.current.includes(list)
      );
      newLists.forEach((newList) => {
        setOrigListNames((prevNames) => ({
          ...prevNames,
          [newList.id]: newList.title,
        }));
        setNewListNames((prevNames) => ({
          ...prevNames,
          [newList.id]: newList.title,
        }));
      });
    }
    prevListsRef.current = lists;
  }, [lists]);

  const [handleEditMode, setHandleEditMode] = useState(null);
  const [origListNames, setOrigListNames] = useState(
    lists.reduce((names, list) => {
      names[list.id] = list.title;

      return names;
    }, {})
  );

  const [newListNames, setNewListNames] = useState({ ...origListNames });

  const textInputRefs = useRef(new Map());

  //ペンシルアイコンを呼ぶと発動
  const handleToggleEditMode = (id) => {
    if (handleEditMode === id) {
      setHandleEditMode(null);
    } else {
      setHandleEditMode(id);
      setTimeout(() => {
        focus(id);
      }, 0);
    }
  };

  //その場編集関数
  const focus = (id) => {
    const textInput = textInputRefs.current[id];
    if (textInput && textInput.current) {
      textInput.current.focus();
    }
  };

  const save = (id) => {
    if (newListNames[id] !== "") {
      const updatedListNames = { ...origListNames, [id]: newListNames[id] };
      setOrigListNames(updatedListNames);
      setHandleEditMode(null);

      //ローカルストレージに保存

      const existingListsItem = window.localStorage.getItem("listNames");
      const parsedLists = existingListsItem
        ? JSON.parse(existingListsItem)
        : null;
      const existingLists = Array.isArray(parsedLists) ? parsedLists : [];
      let updatedLists = existingLists.filter((existingList) => {
        return existingList.id !== id;
      });
      updatedLists.push({ id: id, title: newListNames[id] });
      window.localStorage.setItem("listNames", JSON.stringify(updatedLists));
    }
  };

  const cancel = () => {
    setNewListNames(origListNames);
    setHandleEditMode(null);
  };
  //その場編集関数

  //ゴミ箱モードを呼ぶと発動＆ゴミ箱モード中に×を押しても発動
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
    //ローカルストレージに保存

    const existingListsItem = window.localStorage.getItem("listNames");
    const parsedLists = existingListsItem
      ? JSON.parse(existingListsItem)
      : null;
    const existingLists = Array.isArray(parsedLists) ? parsedLists : [];
    const updatedLists = existingLists.filter((existingList) => {
      return existingList.id !== id;
    });
    window.localStorage.setItem("listNames", JSON.stringify(updatedLists));
  };

  useEffect(() => {
    if (handleEditMode !== null) {
      setTimeout(() => {
        focus(handleEditMode);
      }, 0);
    }
  }, [handleEditMode]);

  useEffect(() => {
    const newRefs = lists.reduce((refs, list) => {
      refs[list.id] = React.createRef();
      return refs;
    }, {});
    textInputRefs.current = newRefs;
  }, [lists]);

  return (
    <div className="flex w-full flex-col gap-1">
      {lists.map((list) => (
        <div className="relative flex items-center group" key={list.id}>
          {(() => {
            if (handleEditMode === list.id) {
              return (
                <div
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-[12.5px] transition-colors duration-200 hover:bg-[#343541]/90"
                  onClick={() => onListClick(list.id)}
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
                  <input
                    ref={textInputRefs.current[list.id]}
                    type="text"
                    className="text-white  outline-none bg-transparent inline-flex items-center py-0 lh-[1] leading-[1]"
                    value={newListNames[list.id]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewListNames({
                        ...newListNames,
                        [list.id]: e.target.value,
                      })
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") save(list.id);
                      if (e.key === "Escape") cancel();
                    }}
                  />
                </div>
              );
            } else {
              return (
                <button
                  className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
                  onClick={() => onListClick(list.id)}
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
                    <div className="text-white relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 pr-12">
                      {newListNames[list.id]}
                    </div>
                  </div>
                </button>
              );
            }
          })()}

          <div className="absolute right-1 z-10 flex text-gray-300 opacity-0 group-hover:opacity-100"></div>

          {/*表示アイコンの分岐処理 */}

          {(() => {
            if (deleteConfirmMode === list.id) {
              return (
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
              );
            } else if (handleEditMode === list.id) {
              return (
                <div className="absolute right-1 z-10 flex text-gray-300">
                  {/* Checkmark button */}
                  <button
                    className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                    onClick={() => save(list.id)}
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
                    onClick={() => cancel()}
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
              );
            } else {
              return (
                <div className="absolute right-1 z-10 flex text-gray-300 opacity-0 group-hover:opacity-100">
                  {/* Pencil button */}
                  <button
                    className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
                    onClick={() => {
                      handleToggleEditMode(list.id);
                    }}
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
              );
            }
          })()}
        </div>
      ))}
    </div>
  );
};

export default NewListCreator;
