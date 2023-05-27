import React, { useState, useEffect, useCallback } from "react";
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
    useState<number[]>([]);
  const [formattedInput, setFormattedInput] = useState<string[]>([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [title, setTitle] = useState<string | null>("");
  const [cookieExpires, setCookieExpires] = useState(0);
  const [isHexagonClicked, setIsHexagonClicked] = useState(false);
  const [is640Over, setIs640Over] = useState<boolean>(
    typeof window !== "undefined" ? window.innerWidth > 639 : false
  );

  //リストの名前が変更されたとき表示を上書きする
  useEffect(() => {
    setTitle(listTitle);
  }, [listTitle]);

  // クッキーからリストアイテムを取得して初期値とする
  const initialListItems =
    selectedListId && Cookies.get(selectedListId)
      ? JSON.parse(Cookies.get(selectedListId) || "").join("\n") //
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

  //現在時刻からcookieの有効期限までの残り時間計算
  //
  //
  //

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

  //ユーザーの入力を整形して表示する。
  const formatUserInput = (userInput: string): string[] => {
    const userInputList = userInput.split("\n");
    const rib_space_from_listNames = userInputList.map((name) =>
      name.replace(/[\s　]/g, "")
    );
    const rib_null_from_userInputList =
      rib_space_from_listNames.filter(Boolean);
    const uniqueNameList = rib_null_from_userInputList.filter(
      (value, index, self) => {
        return self.indexOf(value) === index;
      }
    );
    const formattedUserInput = uniqueNameList;
    return formattedUserInput;
  };

  //ユーザー入力整形後画面の行番号生成
  const getLineNumberOfFormattedUserInput = (formattedUserInput: string[]) => {
    const lineNumber = formattedUserInput.length;
    const lines = [];
    for (let i = 1; i <= lineNumber; i++) {
      lines.push(i);
    }
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
      getLineNumberOfFormattedUserInput(formattedInput)
    );
  }, [formattedInput]);

  useEffect(() => {
    handleInputConfirm();
  }, [formattedInput, handleInputConfirm]);

  useEffect(() => {
    setTotalBytes(calculateBytes());
  }, [formattedInput, calculateBytes]);

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
      >
        {selectedListId ? (
          <div>
            <div className="flex justify-around mt-28">
              <div className="userInput flex flex-col">
                <div className="info border border-solid p-1 ml-8 rounded-lg text-center border-gray-400">
                  <p>改行して名前を入力</p>
                </div>
                <div className="flex">
                  <div className="line-number mr-4 text-right">
                    {/* margin-rightを追加してtextareaとの間にスペースを作ります */}
                    {lineNumbersOfUserInput.map((num, index) => (
                      <p key={index}>{num}</p>
                    ))}
                  </div>
                  <textarea
                    id="textarea"
                    value={inputText}
                    className="pl-2 text-black  border-2 border-black"
                    onChange={handleOnChange}
                    onBlur={handleInputConfirm} // テキストエリアからフォーカスが外れたとき（入力が確定したとき）にhandleInputConfirmを呼び出す
                    rows={lineNumbersOfUserInput.length}
                    wrap="off"
                  />
                </div>
              </div>
              <div className="formatted flex flex-col">
                <div className="info border border-solid p-1 ml-8 rounded-lg text-center border-gray-400">
                  <p>整形後の名前</p>
                </div>
                <div className="flex">
                  <div className="line-number mr-4 text-right">
                    {lineNumbersOfFormattedUserInput.map((num, index) => (
                      <p key={index}>{num}</p>
                    ))}
                  </div>
                  <div className="formatted-list">
                    {formattedInput.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            {isOpen ? (
              <div
                onClick={toggleOpen}
                className="absolute top-0 left-0 z-10 min-h-screen h-full w-full bg-black opacity-60 sm:hidden"
              ></div>
            ) : (
              ""
            )}
            <div className="mx-auto flex w-[300px] flex-col justify-center mt-10 space-y-6 lg:w-[600px]">
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
                  入力された名前データの保存期間は、基本的に365日、一部ブラウザで7日間です。
                </div>
                <div className="mb-2">
                  リスト名をクリックすると、そのリストのcookieの保存期間が更新・延長されます。
                </div>
                <div className="mb-10">
                  もしご自身でリストの保存期間を確認されたい場合は、「cookie
                  確認方法」などと検索してください。
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default EditListForm;
