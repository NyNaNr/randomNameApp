import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import Layout from "./Layout";
import { isMobile } from "../../utils/random_name_app";
import { HexagonLetterR } from "tabler-icons-react";

type EditListFormProps = {
  selectedListId: string | null;
  listTitle: string | null;
  isOpen: boolean;
  toggleOpen: () => void;
};

const EditListForm = ({
  selectedListId,
  listTitle,
  isOpen,
  toggleOpen,
}: EditListFormProps) => {
  const [lineNumbersOfUserInput, setLineNumbersOfUserInput] = useState<
    number[]
  >([]);
  const [lineNumbersOfFormattedUserInput, setLineNumbersOfFormattedUserInput] =
    useState<(string | number)[]>([]);
  //最低限の修正
  const [formattedInput, setFormattedInput] = useState<string[]>([]);
  // 除外する管理
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  //ユーザーオプション反映
  const [modifiedInput, setModifiedInput] = useState<string[]>([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [title, setTitle] = useState<string | null>("");
  const [cookieExpires, setCookieExpires] = useState(0);
  const [isHexagonClicked, setIsHexagonClicked] = useState(false);
  const [is640Over, setIs640Over] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth > 639 : false
  );
  //以下詳細設定のチェックボックスの状態管理
  const [isDeleteSpaceChecked, setIsDeleteSpaceChecked] = useState(true);
  const [isNewLineChecked, setIsNewLineChecked] = useState(false);

  //リストの名前が変更されたとき表示を上書きする
  useEffect(() => {
    setTitle(listTitle);
  }, [listTitle]);

  // クッキーからリストアイテムを取得して初期値とする
  const initialListItems =
    selectedListId && Cookies.get(selectedListId)
      ? JSON.parse(Cookies.get(selectedListId) || "[]").join("\n") //
      : "";
  const [inputText, setInputText] = useState(initialListItems); // ユーザー入力を管理するためのstate

  // 整形済みの配列をcookieに保存する
  const handleInputConfirm = useCallback(() => {
    // 配列をクッキーに保存
    if (selectedListId) {
      Cookies.set(selectedListId, JSON.stringify(formattedInput), {
        expires: 365,
      });
    }

    //cookieの有効期限をローカルストレージに保存
    const now = new Date();
    const oneYearLater = new Date(now.setFullYear(now.getFullYear() + 1));
    if (selectedListId) {
      const newItem = { key: selectedListId, expires: oneYearLater.toString() };

      const existingItems = JSON.parse(
        window.localStorage.getItem("cookieExpires") || "[]"
      );
      const existingItemIndex = existingItems.findIndex(
        (item: { key: string }) => item.key === selectedListId
      );

      if (existingItemIndex >= 0) {
        // 配列にすでに同じキーのアイテムがある場合、それを新しいアイテムで更新する
        existingItems[existingItemIndex] = newItem;
      } else {
        // 同じキーのアイテムがない場合、新しいアイテムを配列に追加する
        existingItems.push(newItem);
      }

      window.localStorage.setItem(
        "cookieExpires",
        JSON.stringify(existingItems)
      );
    }
  }, [formattedInput, selectedListId]);

  // チェックボックスがクリックされたときのハンドラ
  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    let updatedIndexes = [...checkedIndexes];
    if (isChecked) {
      updatedIndexes.push(index);
    } else {
      updatedIndexes = updatedIndexes.filter((i) => i !== index);
    }
    setCheckedIndexes(updatedIndexes);

    const storedData = JSON.parse(
      localStorage.getItem("checkedIndexes") || "{}"
    );
    if (selectedListId === null) return; // 追加
    storedData[selectedListId] = updatedIndexes;
    localStorage.setItem("checkedIndexes", JSON.stringify(storedData));
  };

  // selectedListIdが変わるたびに、クッキーからリストアイテムを取得してstateを更新する
  useEffect(() => {
    const listItems =
      selectedListId && Cookies.get(selectedListId)
        ? JSON.parse(Cookies.get(selectedListId) || "").join("\n")
        : "";
    setInputText(listItems);
  }, [selectedListId]);

  //ユーザー入力画面の行番号生成
  const getLineNumberOfUserInput = (currentListString: string) => {
    const currentList = currentListString.split("\n");
    const lineNumber = currentList.length;
    const lines = [];
    for (let i = 1; i <= lineNumber; i++) {
      lines.push(i);
    }
    setLineNumbersOfUserInput(lines);
  };

  //ユーザーの入力を整形して表示する。（最低限）
  const formatUserInput = (userInput: string): string[] => {
    const userInputList = userInput.split("\n");

    // 空文字列の削除
    const rib_null_from_userInputList = userInputList.filter(Boolean);

    //重複要素の削除
    const uniqueNameList = rib_null_from_userInputList.filter(
      (value, index, self) => {
        return self.indexOf(value) === index;
      }
    );
    const formattedUserInput = uniqueNameList;
    return formattedUserInput;
  };
  //ユーザーの入力を整形して表示する。（最低限）

  //1.詳細設定にてUserOptionを反映する
  const applyUserOptions = useCallback(
    (formattedInput: string[]): string[] => {
      // isDeleteSpaceCheckedがtrueの場合、名前間のスペースを削除する
      if (isDeleteSpaceChecked) {
        return formattedInput.map((name) => name.replace(/[\s　]/g, ""));
      }
      // isNewLineCheckedがtrueの場合、名前間のスペースを改行に置き換える
      else if (isNewLineChecked) {
        return formattedInput.map((name) =>
          name.replace(/(?<=\S)([ ]{1,}|\u3000{1,})(?=\S)/g, "\n")
        );
      }
      return formattedInput;
    },
    [isDeleteSpaceChecked, isNewLineChecked]
  );

  //1.詳細設定にてUserOptionを反映する

  //ユーザー入力整形後画面の行番号生成
  const getLineNumberOfFormattedUserInput = (formattedUserInput: string[]) => {
    let currentLineNumber = 1;
    const lines: (number | string)[] = [];

    formattedUserInput.forEach((name) => {
      // 各入力要素の中での改行数をカウント
      const newLinesInName = (name.match(/\n/g) || []).length;

      // 最初の行に行番号を追加
      lines.push(currentLineNumber);

      // 残りの行に何も割り当てない（または" "を割り当てる）
      for (let i = 1; i <= newLinesInName; i++) {
        lines.push(" ");
      }

      currentLineNumber += 1;
    });

    return lines;
  };

  //子コンポーネントに合計人数を渡すための処理
  const lineNumber = formattedInput.length;

  //ユーザー入力のバイト数を計算
  const calculateBytes = useCallback(() => {
    let totalBytes = 0;
    const encodedName = encodeURIComponent(JSON.stringify(formattedInput));
    totalBytes += encodedName.length;
    totalBytes -= 6; //初期値はキーとバリュー[]が計算される[]をエンコードした%5B%5Dの6バイト分引いておく
    return totalBytes;
  }, [formattedInput]);

  //アイコン触った判定
  const handleHexagonClick = () => {
    setIsHexagonClicked(true);
    setTimeout(() => setIsHexagonClicked(false), 1000); // アニメーションの時間に合わせて設定
  };

  // onChange handler
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    getLineNumberOfUserInput(e.target.value);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const delayedHexagonClick = () => {
      timeoutId = setTimeout(() => {
        handleHexagonClick();
      }, 1000); // 1000ms (1秒)後に実行
    };

    if (is640Over) {
      !selectedListId && delayedHexagonClick();
    } else {
      if (!selectedListId && !isOpen) {
        delayedHexagonClick();
      }
    }

    return () => clearTimeout(timeoutId); // cleanup関数でtimeoutをクリア
  }, [selectedListId, is640Over, isOpen]);

  useEffect(() => {
    getLineNumberOfUserInput(inputText);
  }, [inputText]);

  useEffect(() => {
    setFormattedInput(formatUserInput(inputText));
  }, [inputText]);

  useEffect(() => {
    setLineNumbersOfFormattedUserInput(
      getLineNumberOfFormattedUserInput(modifiedInput)
    );
  }, [modifiedInput]);

  useEffect(() => {
    handleInputConfirm();
  }, [formattedInput, handleInputConfirm]);

  useEffect(() => {
    setTotalBytes(calculateBytes());
  }, [formattedInput, calculateBytes]);

  useEffect(() => {
    setModifiedInput(applyUserOptions(formattedInput));
  }, [formattedInput, isDeleteSpaceChecked, applyUserOptions]); // こちらの依存配列を更新

  // 除外をローカルストレージから読み込む
  useEffect(() => {
    if (selectedListId === null) return; // 追加
    const storedData = JSON.parse(
      localStorage.getItem("checkedIndexes") || "{}"
    );
    const indexesForCurrentList = storedData[selectedListId] || [];
    setCheckedIndexes(indexesForCurrentList);
  }, [selectedListId]);

  //selectedListIdが変わるにつれて、テキストエリアの末尾にカーソルを移動させる。スマホでは邪魔な機能かも？
  useEffect(() => {
    if (isMobile()) {
    } else {
      const t = document.getElementById("textarea") as HTMLTextAreaElement;
      // 適切なnullチェックを行う
      if (t !== null) {
        const len = t.value.length;
        t.selectionStart = len;
        t.selectionEnd = len;
        t.focus();
      }
    }
  }, [selectedListId]);

  return (
    <React.Fragment>
      <Layout
        selectedListId={selectedListId}
        totalBytes={totalBytes}
        lineNumber={lineNumber}
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        isDeleteSpaceChecked={isDeleteSpaceChecked}
        setIsDeleteSpaceChecked={setIsDeleteSpaceChecked}
        isNewLineChecked={isNewLineChecked}
        setIsNewLineChecked={setIsNewLineChecked}
      >
        {selectedListId ? (
          <div className="">
            <div className="flex justify-around mt-28">
              <div className="userInput flex flex-col">
                <div className="info border border-solid p-1 ml-8 rounded-lg text-center border-gray-400">
                  <p>改行して名前を入力</p>
                </div>
                <div className="flex">
                  <div className="line-number mr-4 text-right">
                    {lineNumbersOfUserInput.map((num, index) => (
                      <p key={index}>{num}</p>
                    ))}
                  </div>
                  <textarea
                    id="textarea"
                    value={inputText}
                    className="pl-2 text-black  border-2 border-black mb-5"
                    onChange={handleOnChange}
                    onBlur={handleInputConfirm} // テキストエリアからフォーカスが外れたとき（入力が確定したとき）にhandleInputConfirmを呼び出す
                    rows={lineNumbersOfUserInput.length}
                    wrap="off"
                  />
                </div>
              </div>
              <div className="formatted flex flex-col w-[175px] ">
                <div className="info flex justify-between ">
                  <p className="border border-solid p-1 rounded-lg border-gray-400 ml-4">
                    除外
                  </p>
                  <p className="border border-solid p-1 rounded-lg text-center border-gray-400">
                    表示される名前
                  </p>
                </div>
                <div className="flex">
                  <div className="line-number mr-4 text-right">
                    {lineNumbersOfFormattedUserInput.map((num, index) => (
                      <div key={index} className="flex justify-end space-x-2">
                        <p>{num === " " ? <>&nbsp;</> : num}</p>
                        <p>
                          {num !== " " && (
                            <input
                              type="checkbox"
                              checked={checkedIndexes.includes(Number(num) - 1)} // 実際の行番号を使う
                              onChange={(e) =>
                                handleCheckboxChange(
                                  Number(num) - 1,
                                  e.target.checked
                                )
                              }
                            />
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="formatted-list overflow-hidden w-full ">
                    {modifiedInput.map((item, index) => (
                      <p
                        className={`${
                          isNewLineChecked
                            ? "whitespace-pre-wrap"
                            : "text-ellipsis"
                        } whitespace-nowrap overflow-hidden w-full ${
                          checkedIndexes.includes(index) ? "line-through" : ""
                        }`}
                        key={index}
                      >
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center justify-center md:min-h-screen"
            style={{
              minHeight: "100dvh",
            }}
          >
            <div className="flex flex-col items-center m-10">
              {isOpen ? (
                <div
                  onClick={toggleOpen}
                  className="absolute top-0 left-0 z-10 md:min-h-screen h-full w-full bg-black opacity-60 sm:hidden"
                ></div>
              ) : (
                ""
              )}
              <div className="mx-auto flex w-[300px] flex-col justify-center space-y-6 lg:w-[600px]">
                <div className="text-center text-4xl lg:text-5xl font-bold text-black dark:text-white">
                  Welcome to{" "}
                  <span className="text-3xl lg:text-5xl">
                    <br></br>Random Name App
                  </span>
                </div>
                <div
                  className={`flex justify-center text-black dark:text-white ${
                    isHexagonClicked ? "animate-spinOnce" : ""
                  }`}
                  onClick={handleHexagonClick}
                >
                  <HexagonLetterR
                    size={isMobile() ? 150 : 200}
                    strokeWidth={0.5}
                    color={"currentColor"}
                  />
                </div>
                <div className="text-center text-gray-500 dark:text-gray-400 ">
                  <div className="mb-2">
                    このWebアプリは、児童生徒の名前をランダムにビンゴ形式で表示したり、グループやペアをランダムに瞬時に決定したりすることができます。
                  </div>
                  <div className="mb-2">
                    特にランダムにペアやグループを作れる機能は、授業を効率的に進めるために有効です。
                  </div>
                  <div className="mb-10">
                    名前だけでなく、英単語を表示したり結婚式などの余興でも使うことができます。
                  </div>
                </div>
              </div>
              <div className="relative bottom-0 right-0 bg-transparent flex flex-col">
                <Link
                  href={`/random_name_app/features`}
                  className={
                    "border-2 border-solid p-2 rounded-lg border-gray-200 text-gray-600 mb-1 dark:text-white hover:bg-gray-100 font-medium text-center"
                  }
                >
                  アプリの紹介と個人情報の取り扱い
                </Link>
                <Link
                  href={`/random_name_app/howToUse`}
                  className={
                    "border-2 border-solid p-2 rounded-lg border-gray-200 text-gray-600 dark:text-white hover:bg-gray-100 font-medium text-center"
                  }
                >
                  アプリの使い方で困ったら
                </Link>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default EditListForm;
