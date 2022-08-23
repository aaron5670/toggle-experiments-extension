const localStorageInjector = (localStorageKey: string, localStorageValue: string): void => {
  localStorage.setItem(localStorageKey, localStorageValue);
  document.location.reload();
}

export default localStorageInjector
