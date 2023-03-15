export const setLocalStorageValue = (localStorageKey: string, localStorageValue: string): void => {
  localStorage.setItem(localStorageKey, localStorageValue);
  document.location.reload();
}

export const deleteLocalStorageValue = (localStorageKey: string): void => {
  localStorage.removeItem(localStorageKey);
  document.location.reload();
}

export const getLocalStorageValue = (localStorageKey: string): string => {
  return localStorage.getItem(localStorageKey);
}
