import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import Layout from "./Layout";

type EditListFormProps = {
  selectedListId: string | null;
  listTitle: string | null;
};

const EditListForm = ({ selectedListId, listTitle }: EditListFormProps) => {
  const [lineNumbersOfUserInput, setLineNumbersOfUserInput] = useState<
    number[]
  >([]);
  const [lineNumbersOfFormattedUserInput, setLineNumbersOfFormattedUserInput] =
    useState<number[]>([]);
  const [formattedInput, setFormattedInput] = useState<string[]>([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [title, setTitle] = useState<string | null>("");

  //idを使ってtitleを取得
  const getTitleFromLocalstorage = useCallback(() => {
    let listNames = null;
    if (typeof window !== "undefined") {
      const storedListNames = localStorage.getItem("listNames");
      listNames = storedListNames ? JSON.parse(storedListNames) : null;
    }
    const idToSearch = selectedListId; // 特定のidを持つオブジェクトを検索
    const item = listNames
      ? listNames.find(
          (list: { id: string; title: string }) => list.id === idToSearch
        )
      : null;
    const title = item ? item.title : null; // itemが存在すればそのtitleを、存在しなければnullを返す
    return title;
  }, [selectedListId]);

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
        expires: 7,
      });
    } // expiresで有効期限を設定（ここでは7日）
  }, [formattedInput, selectedListId]);

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

  //ユーザー入力のバイト数を計算
  const calculateBytes = useCallback(() => {
    let totalBytes = 0;
    const encodedName = encodeURIComponent(JSON.stringify(formattedInput));
    totalBytes += encodedName.length;
    totalBytes += 38 - 6; //初期値はキーとバリュー[]が計算される[]をエンコードした%5B%5Dの6バイト分引いておく
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

  useEffect(() => {
    setTitle(getTitleFromLocalstorage());
  }, [selectedListId, getTitleFromLocalstorage]);

  return (
    <React.Fragment>
      <Layout
        title={title}
        selectedListId={selectedListId}
        totalBytes={totalBytes}
      >
        {selectedListId ? (
          <div>
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
                  className="pl-2 text-black  border-2 border-black"
                  onChange={handleOnChange}
                  onBlur={handleInputConfirm} // テキストエリアからフォーカスが外れたとき（入力が確定したとき）にhandleInputConfirmを呼び出す
                  rows={lineNumbersOfUserInput.length}
                  wrap="off"
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
      </Layout>
    </React.Fragment>
  );
};

export default EditListForm;
