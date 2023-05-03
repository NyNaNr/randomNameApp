import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";

const ListManager = () => {
  const [listNames, setListNames] = useState([]);

  useEffect(() => {
    // コンポーネントがマウントされた時にCookieからリスト名を読み込む
    const listNamesJson = Cookie.get("listNames");
    if (listNamesJson) {
      setListNames(JSON.parse(listNamesJson));
    }
  }, []);

  // 上で定義したリスト操作関数を使用して、各操作を実行する関数を定義します。
  const createListName = (newListName) => {
    // Cookieからリスト名のデータを取得
    const listNamesJson = Cookie.get("listNames");

    // データが存在する場合、JSONをパースしてリスト名の配列を取得
    let listNames = listNamesJson ? JSON.parse(listNamesJson) : [];

    // 新しいリスト名を追加
    listNames.push(newListName);

    // リスト名の配列をJSON文字列に変換してCookieに保存
    Cookie.set("listNames", JSON.stringify(listNames));

    // 状態を更新
    setListNames(listNames);
  };

  const deleteListName = (targetListName) => {
    // Cookieからリスト名のデータを取得
    const listNamesJson = Cookie.get("listNames");

    // データが存在する場合、JSONをパースしてリスト名の配列を取得
    let listNames = listNamesJson ? JSON.parse(listNamesJson) : [];

    // 対象のリスト名を削除
    listNames = listNames.filter((listName) => listName !== targetListName);

    // リスト名の配列をJSON文字列に変換してCookieに保存
    Cookie.set("listNames", JSON.stringify(listNames));
    // 状態を更新
    setListNames(listNames);
  };

  const updateListName = (oldListName, newListName) => {
    // Cookieからリスト名のデータを取得
    const listNamesJson = Cookie.get("listNames");

    // データが存在する場合、JSONをパースしてリスト名の配列を取得
    let listNames = listNamesJson ? JSON.parse(listNamesJson) : [];

    // 対象のリスト名を更新
    listNames = listNames.map((listName) =>
      listName === oldListName ? newListName : listName
    );

    // リスト名の配列をJSON文字列に変換してCookieに保存
    Cookie.set("listNames", JSON.stringify(listNames));
    // 状態を更新
    setListNames(listNames);
  };

  const reorderListNames = (newListNamesOrder) => {
    // リスト名の配列をJSON文字列に変換してCookieに保存
    Cookie.set("listNames", JSON.stringify(listNames));
    setListNames(listNames);
  };

  // これらの操作をUIに反映させます。
  return (
    <div>
      {/* リスト名を表示する */}
      <ul>
        {listNames.map((listName) => (
          <li key={listName}>{listName}</li>
        ))}
      </ul>
      {/* リスト名を作成・削除・変更・並べ替えるためのフォームやボタンを追加します */}
      ...
    </div>
  );
};

export default ListManager;
