import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { fetchListsFromLocalStorage } from "../../utils/random_name_app";
import List from "../../utils/dnd";

import Cookies from "js-cookie";

type ListType = {
  id: string;
  title: string;
};

type TextInputRefsType = {
  [key: string]: React.RefObject<HTMLInputElement>;
};

type NewListCreatorProps = {
  lists: ListType[];
  setLists: React.Dispatch<React.SetStateAction<ListType[]>>;
  onListClick: (id: string) => void;
  setSelectedListId: React.Dispatch<React.SetStateAction<string | null>>;
  setListTitle: React.Dispatch<React.SetStateAction<string | null>>;
  selectedListId: string | null;
};

//新規リスト作成
const NewListCreator: React.FC<NewListCreatorProps> = ({
  lists,
  setLists,
  onListClick,
  setSelectedListId,
  setListTitle,
  selectedListId,
}) => {
  useEffect(() => {
    const listsFromLocalStorage = fetchListsFromLocalStorage();
    console.log("listsFromLocalStorage", listsFromLocalStorage);
    setLists(listsFromLocalStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //ゴミ箱
  const [deleteConfirmMode, setDeleteConfirmMode] = useState<string | null>(
    null
  );
  //その場編集
  const prevListsRef = useRef<ListType[]>([]);
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

  const [handleEditMode, setHandleEditMode] = useState<string | null>(null);
  const [origListNames, setOrigListNames] = useState<{
    [key: string]: string | number;
  }>(
    lists?.reduce((names: { [key: string]: string | number }, list) => {
      if (list && list.id && list.title) {
        names[list.id] = list.title;
      }
      return names;
    }, {} || {})
  );

  const [newListNames, setNewListNames] = useState({ ...origListNames });

  const textInputRefs = useRef<TextInputRefsType>({});

  //ペンシルアイコンを呼ぶと発動
  const handleToggleEditMode = (id: string) => {
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
  const focus = (id: string) => {
    const textInput = textInputRefs.current[id];
    if (textInput && textInput.current) {
      textInput.current.focus();
    }
  };
  //その場編集関数
  const save = (id: string) => {
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

      let updatedLists = existingLists.map((existingList) => {
        if (existingList.id === id) {
          // if the list id matches, update the title
          return { id: id, title: newListNames[id] };
        } else {
          // otherwise, return the list as is
          return existingList;
        }
      });

      setLists(updatedLists);
      window.localStorage.setItem("listNames", JSON.stringify(updatedLists));
      setListTitle(newListNames[id].toString());
    }
  };
  //その場編集関数
  const cancel = () => {
    setNewListNames(origListNames);
    setHandleEditMode(null);
  };

  //ゴミ箱モードを呼ぶと発動＆ゴミ箱モード中に×を押しても発動
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
  //ゴミ箱モードでチェックマークを押すと発動2
  const handleDeleteListOfCookie = (id: string) => {
    Cookies.remove(id);
  };
  //ゴミ箱モードでチェックマークを押すと発動3
  const selectedListIdToNull = () => {
    setSelectedListId(null);
  };

  useEffect(() => {
    if (handleEditMode !== null) {
      setTimeout(() => {
        focus(handleEditMode);
      }, 0);
    }
  }, [handleEditMode]);

  useEffect(() => {
    const newRefs = lists.reduce(
      (refs: { [key: string]: React.RefObject<HTMLInputElement> }, list) => {
        if (list) {
          refs[list.id] = React.createRef();
        }
        return refs;
      },
      {}
    );
    textInputRefs.current = newRefs;
  }, [lists, setLists]);

  return (
    <DragDropContext
      onDragEnd={(param) => {
        const srcI = param.source.index;
        const desI = param.destination?.index;
        if (desI !== undefined) {
          //以下の分岐は、onDragEnd処理後、save()処理後の競合を避けるため
          if (lists.length >= 1) {
            lists.splice(desI, 0, lists.splice(srcI, 1)[0]);
            List.saveList(lists);
            setLists(lists);
          } else {
            lists.splice(desI, 0, lists.splice(srcI, 1)[0]);
            List.saveList(lists);
          }
        }
      }}
    >
      <Droppable droppableId="eachList">
        {(provided) => (
          <div
            className="eachList "
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {lists.map(
              (list, index) =>
                list && (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative flex items-center group bg-[#202123] rounded-lg opacity-80 ${
                          list.id === selectedListId
                            ? "bg-blue-500 rounded-lg"
                            : ""
                        }`}
                      >
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
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                  ) =>
                                    setNewListNames({
                                      ...newListNames,
                                      [list.id]: e.target.value,
                                    })
                                  }
                                  onKeyDown={(
                                    e: React.KeyboardEvent<HTMLInputElement>
                                  ) => {
                                    if (e.key === "Enter") save(list.id);
                                    if (e.key === "Escape") cancel();
                                  }}
                                />
                              </div>
                            );
                          } else {
                            return (
                              <button
                                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 ${
                                  list.id === selectedListId
                                    ? ""
                                    : "hover:bg-[#343541]/90"
                                } `}
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
                                  className="cursor-grab"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                                  />
                                </svg>

                                <div
                                  className={`text-white relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left  leading-5 pr-12 ${
                                    list.id === selectedListId
                                      ? "text-[14.5px] font-semibold"
                                      : "text-[12.5px]"
                                  }`}
                                >
                                  {newListNames[list.id]}
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
                                  onClick={() => {
                                    handleDeleteList(list.id);
                                    handleDeleteListOfCookie(list.id);
                                    selectedListIdToNull();
                                  }}
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
                                  onClick={() =>
                                    handleToggleDeleteConfirmMode(list.id)
                                  }
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
                                    onListClick(list.id);
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
                                  onClick={() => {
                                    handleToggleDeleteConfirmMode(list.id);
                                    onListClick(list.id);
                                  }}
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
                    )}
                  </Draggable>
                )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default NewListCreator;
