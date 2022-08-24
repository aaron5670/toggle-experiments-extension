import { deleteLocalStorageValue, setLocalStorageValue } from "~local-storage-injector";

export const updateLocalStorageValue = async (tabId, localStorageKey, localStorageValue) => {
  await chrome.scripting.executeScript(
    {
      target: { tabId },
      world: "MAIN", // MAIN in order to access the window object
      func: setLocalStorageValue,
      args: [localStorageKey, localStorageValue]
    }
  );
};

export const removeLocalStorageValue = async (tabId, localStorageKey) => {
  await chrome.scripting.executeScript(
    {
      target: { tabId },
      world: "MAIN", // MAIN in order to access the window object
      func: deleteLocalStorageValue,
      args: [localStorageKey]
    }
  );
};
