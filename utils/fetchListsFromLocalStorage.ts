export const fetchListsFromLocalStorage = () => {
  const storedLists = localStorage.getItem("listNames");
  const parsedLists = storedLists ? JSON.parse(storedLists) : [];
  return Array.isArray(parsedLists) ? parsedLists : [];
};
