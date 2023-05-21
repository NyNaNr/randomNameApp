export const fetchListsFromLocalStorage = () => {
  const storedLists = localStorage.getItem("listNames");
  const parsedLists = storedLists ? JSON.parse(storedLists) : [];
  return Array.isArray(parsedLists) ? parsedLists : [];
};

export const isMobile = () => {
  if (typeof window !== "undefined") {
    //画面サイズの篩
    if (
      window.matchMedia &&
      window.matchMedia("(max-device-width: 640px)").matches
    ) {
      return true;
    } else {
      //ユーザーエージェントの篩
      if (
        //スマホ・タブレットの場合
        navigator.userAgent.indexOf("iPhone") > 0 ||
        (navigator.userAgent.indexOf("Android") > 0 &&
          navigator.userAgent.indexOf("Mobile") > 0) ||
        navigator.userAgent.indexOf("iPad") > 0 ||
        navigator.userAgent.indexOf("Android") > 0
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
