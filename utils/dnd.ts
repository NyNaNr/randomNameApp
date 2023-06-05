type ListType = {
  id: string;
  title: string;
};

const List = {
  getList: function () {
    if (typeof window !== "undefined") {
      const list = window.localStorage.getItem("listNames");
      return list ? JSON.parse(list) : null;
    }
  },
  saveList: (list: ListType[]) => {
    window.localStorage.setItem("listNames", JSON.stringify(list));
  },
};

export default List;
