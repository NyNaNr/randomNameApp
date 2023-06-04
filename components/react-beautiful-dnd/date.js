const List = {
  list: [
    {
      id: 1,
      title: "Read some news",
    },
    {
      id: 2,
      title: "Go out for a walk",
    },
    {
      id: 3,
      title: "Do some exercise",
    },
    {
      id: 4,
      title: "Watch tutorials on YouTube",
    },
    {
      id: 5,
      title: "Netflix and chill",
    },
    {
      id: 6,
      title: "Read a book",
    },
  ],
getList: function () {
  if (typeof window !== 'undefined') {
    return (
      (window.localStorage.getItem("theList") &&
        JSON.parse(window.localStorage.getItem("theList"))) ||
      this.list
    );
  } else {
    // サーバーサイドではデフォルトのリストを返す（または他の適切な処理）
    return this.list;
  }
},
  saveList: (list) => {
    window.localStorage.setItem("theList", JSON.stringify(list));
  },
};

export default List;
