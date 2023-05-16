import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

const EditListForm = ({ selectedListId }) => {
  const [lineNumbersOfUserInput, setLineNumbersOfUserInput] = useState([]);
  const [lineNumbersOfFormattedUserInput, setLineNumbersOfFormattedUserInput] =
    useState([]);
  const [formattedInput, setFormattedInput] = useState([]);
  const [totalBytes, setTotalBytes] = useState(0);

  //idを使ってtitleを取得
  let listNames = null;
  if (typeof window !== "undefined") {
    listNames = JSON.parse(localStorage.getItem("listNames"));
  }
  const idToSearch = selectedListId; // 特定のidを持つオブジェクトを検索
  const item = listNames
    ? listNames.find((list) => list.id === idToSearch)
    : null;
  const title = item ? item.title : null; // itemが存在すればそのtitleを、存在しなければnullを返す
  //

  // クッキーからリストアイテムを取得して初期値とする
  const initialListItems = Cookies.get(selectedListId)
    ? JSON.parse(Cookies.get(selectedListId)).join("\n") //
    : "";
  const [inputText, setInputText] = useState(initialListItems); // ユーザー入力を管理するためのstate

  // 整形済みの配列をcookieに保存する
  const handleInputConfirm = useCallback(() => {
    // 配列をクッキーに保存
    Cookies.set(selectedListId, JSON.stringify(formattedInput), { expires: 7 }); // expiresで有効期限を設定（ここでは7日）
  }, [formattedInput, selectedListId]);

  // selectedListIdが変わるたびに、クッキーからリストアイテムを取得してstateを更新する
  useEffect(() => {
    const listItems = Cookies.get(selectedListId)
      ? JSON.parse(Cookies.get(selectedListId)).join("\n")
      : "";
    setInputText(listItems);
  }, [selectedListId]);

  //ユーザー入力画面の行番号生成
  const getLineNumberOfUserInput = (currentListString) => {
    const currentList = currentListString.split("\n");
    const lineNumber = currentList.length;
    const lines = [];
    for (let i = 1; i <= lineNumber; i++) {
      lines.push(i);
    }
    setLineNumbersOfUserInput(lines);
  };

  //ユーザーの入力を整形して表示する。
  const formatUserInput = (userInput) => {
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
  const getLineNumberOfFormattedUserInput = (formattedUserInput) => {
    const lineNumber = formattedUserInput.length;
    const lines = [];
    for (let i = 1; i <= lineNumber; i++) {
      lines.push(i);
    }
    return lines;
  };

  //ユーザー入力のバイト数を計算
  const calculateBytes = () => {
    let totalBytes = 0;

    const encodedName = encodeURIComponent(JSON.stringify(formattedInput));
    console.log(encodedName);
    totalBytes += encodedName.length;

    // Cookieのキーとなる文字列のバイト数を追加
    totalBytes += 38 - 6; //初期値はキーとバリュー[]が計算される[]をエンコードした%5B%5Dの6バイト分引いておく

    return totalBytes;
  };

  // onChange handler
  const handleOnChange = (e) => {
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
  }, [formattedInput]);

  return (
    <React.Fragment>
      {selectedListId ? (
        <div>
          <h1 className="flex items-center">{title}</h1>
          <div className="flex items-center">
            <p>合計バイト数: {totalBytes}</p>
          </div>
          <div className="flex">
            <div className="flex">
              <div className="line-number mr-4 text-right">
                {/* margin-rightを追加してtextareaとの間にスペースを作ります */}
                {lineNumbersOfUserInput.map((num, index) => (
                  <p key={index}>{num}</p>
                ))}
              </div>
              <textarea
                value={inputText}
                className="padding: 0.75rem;"
                onChange={handleOnChange}
                onBlur={handleInputConfirm} // テキストエリアからフォーカスが外れたとき（入力が確定したとき）にhandleInputConfirmを呼び出す
                rows={lineNumbersOfUserInput}
              />
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
              <Link href={`/random_name_app/${selectedListId}`}>クリック</Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Webアプリの使い方:</h2>
          <p>1. 左の「新規リストを作成」ボタンをクリックします。</p>
          <p>2. リスト名を入力し、「リストを作成」ボタンをクリックします。</p>
          <p>3. 作成したリストをクリックして選択します。</p>
          <p>4. 右側のテキストエリアにリストアイテムを入力します。</p>
          <p>5. リストアイテムが整形されて下部に表示されます。</p>
        </div>
      )}
    </React.Fragment>
  );
};

export default EditListForm;
