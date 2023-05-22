import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import Layout from "./Layout";
import { isMobile } from "../../utils/random_name_app";

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
    const formattedUserInput = rib_null_from_userInputList;
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

  // onChange handler
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    getLineNumberOfUserInput(e.target.value);
  };

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
      {isOpen ? (
        <div
          onClick={toggleOpen}
          className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
        ></div>
      ) : (
        ""
      )}
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
                <div className="info text-right">
                  <p>ここに名前を入力してください</p>
                  <p>改行で名前を区切ってください</p>
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
                <div className="info text-right">
                  <p>実際に使われる名前は</p>
                  <p>ここに表示されている部分です</p>
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
          <div className="m-10">
            <h1>とにかく大きいランダムネームアップ</h1>
            <br />
            <p>
              当Webアプリは、名前をビンゴのようにランダムに大きく表示するアプリです。
            </p>
            <p>
              授業や講義の指名、結婚式の余興など、さまざまなシーンでご利用いただけます。
            </p>
            <p>
              特徴は、とにかく大きく名前を表示できることで、見やすさを追求しています。
            </p>
            <br />
            <h2>入力された個人情報について</h2>
            <p>
              利用の際に入力される情報は、当Webアプリが外部サーバーに送信することはありません。すべての情報はローカルに保存され、第三者と共有されることはありません。
            </p>
            <p>
              すべての入力された情報はユーザーのパソコン（ブラウザ）にファーストパーティーcookieの技術を用いて保存されます。これはブラウザを閉じても情報が保持され、再度開いた時に同じ情報が表示されることを可能にします。
            </p>
            <p>
              cookieの性質上、ユーザーがリストを編集・保存してから1年後、入力した名前が自動的に削除されます。ただし、Safariブラウザではcookieの保存期限が1週間となる等、ブラウザの仕様変更などで保存できる期限が変わる可能性があります。ユーザーがリストを削除することで、個人情報もブラウザから削除されます。
            </p>
            <p></p>
          </div>
        )}
      </Layout>
    </React.Fragment>
  );
};

export default EditListForm;
