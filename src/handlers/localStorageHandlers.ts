import { deleteLocalStorageValue, getLocalStorageValue, setLocalStorageValue } from "~local-storage-injector";

export const updateLocalStorageValue = async (tabId, localStorageKey, localStorageValue) => {
  await chrome.scripting.executeScript(
    {
      args: [localStorageKey, localStorageValue],
      func: setLocalStorageValue,
      target: { tabId },
      world: "MAIN" // MAIN in order to access the window object
    }
  );
};

export const removeLocalStorageValue = async (tabId, localStorageKey) => {
  await chrome.scripting.executeScript(
    {
      args: [localStorageKey],
      func: deleteLocalStorageValue,
      target: { tabId },
      world: "MAIN" // MAIN in order to access the window object
    }
  );
};

export const getCurrentLocalStorageValue = async (tabId, localStorageKey) => {
  return chrome.scripting.executeScript(
    {
      args: [localStorageKey],
      func: getLocalStorageValue,
      target: { tabId },
      world: "MAIN" // MAIN in order to access the window object
    }
  );
}
