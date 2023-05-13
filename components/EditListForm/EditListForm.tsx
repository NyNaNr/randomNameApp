import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const EditListForm = ({ selectedListId }) => {
  const [lineNumbers, setLineNumbers] = useState([]);

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

  // クッキーからリストアイテムを取得して初期値とする
  const initialListItems = Cookies.get(selectedListId)
    ? JSON.parse(Cookies.get(selectedListId)).join("\n") //
    : "";
  const [inputText, setInputText] = useState(initialListItems); // ユーザー入力を管理するためのstate

  // ユーザーが入力を確定する（改行を入力する）たびに呼び出される関数
  const handleInputConfirm = () => {
    const listItems = inputText.split("\n"); // 入力文字列を改行で分割してリストアイテムを作成

    // クッキーに保存
    Cookies.set(selectedListId, JSON.stringify(listItems), { expires: 7 }); // expiresで有効期限を設定（ここでは7日）
  };

  // selectedListIdが変わるたびに、クッキーからリストアイテムを取得してstateを更新する
  useEffect(() => {
    const listItems = Cookies.get(selectedListId)
      ? JSON.parse(Cookies.get(selectedListId)).join("\n")
      : "";
    setInputText(listItems);
  }, [selectedListId]);

  //行番号生成
  const getLineNumber = (currentListString) => {
    const currentList = currentListString.split("\n");
    const lineNumber = currentList.length;
    const lines = [];
    for (let i = 1; i <= lineNumber; i++) {
      lines.push(i);
    }
    setLineNumbers(lines);
  };

  // onChange handler
  const handleOnChange = (e) => {
    setInputText(e.target.value);
    getLineNumber(e.target.value);
  };

  useEffect(() => {
    getLineNumber(inputText);
  }, [inputText]);

  return (
    <React.Fragment>
      <div className="flex items-center">{selectedListId}</div>
      <div className="flex items-center">{title}</div>
      <div className="flex">
        <div className="line-number mr-4">
          {" "}
          {/* margin-rightを追加してtextareaとの間にスペースを作ります */}
          {lineNumbers.map((num, index) => (
            <p key={index}>{num}</p>
          ))}
        </div>
        <textarea
          value={inputText}
          className=""
          onChange={handleOnChange}
          onBlur={handleInputConfirm} // テキストエリアからフォーカスが外れたとき（入力が確定したとき）にhandleInputConfirmを呼び出す
          rows={lineNumbers}
        />
      </div>
    </React.Fragment>
  );
};

export default EditListForm;
