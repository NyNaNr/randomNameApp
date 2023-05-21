export const fetchListsFromLocalStorage = () => {
  const storedLists = localStorage.getItem("listNames");
  const parsedLists = storedLists ? JSON.parse(storedLists) : [];
  return Array.isArray(parsedLists) ? parsedLists : [];
};

export const isSmartPhone = () => {
  if (
    window.matchMedia &&
    window.matchMedia("(max-device-width: 640px)").matches
  ) {
    return true;
  } else {
    return false;
  }
};
