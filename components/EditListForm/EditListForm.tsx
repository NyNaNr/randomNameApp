import React from "react";

//新規リスト作成
const EditListForm = ({ selectedListId }) => {
  //新規リスト作成

  //idを使ってtitleを取得

  const listNames = JSON.parse(localStorage.getItem("listNames"));

  // 特定のidを持つオブジェクトを検索
  const idToSearch = selectedListId; // ここに検索したいidを指定
  const item = listNames.find((list) => list.id === idToSearch);

  // itemが存在すればそのtitleを、存在しなければnullを返す
  const title = item ? item.title : null;
  console.log(title); // "New List律"が出力されるはずです

  return (
    <React.Fragment>
      <div className="flex items-center">{selectedListId}</div>
      <div className="flex items-center">{title}</div>
    </React.Fragment>
  );
};

export default EditListForm;
