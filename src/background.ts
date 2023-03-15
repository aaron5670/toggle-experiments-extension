import { setLocalStorageValue } from "~local-storage-injector";

const broadcastChannel = new BroadcastChannel('broadcastChannel');

broadcastChannel.onmessage = (event) => {
  const { data } = event;
  const { history, localStorageKey } = data;

  // set the localStorageKey to the one that was sent from the content script
  if (localStorageKey) {
    chrome.storage.local.set({
      "localStorageKey": localStorageKey,
    }, function () {
      console.log(`localStorageKey is set to '${localStorageKey}'`);
    });
  }

  if(history?.length > 1) {
    // first remove all the context menus
    chrome.contextMenus.removeAll();

    // then create the new ones
    history.forEach((item) => {
      chrome.contextMenus.create({
        id: item.key,
        title: `${item.name} (${item.key})`,
        type: "normal",
        contexts: ["all"],
      });
    })
  } else {
    chrome.contextMenus.removeAll();
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tabs) => {
  chrome.storage.local.get(['localStorageKey'], async function(result) {
    await chrome.scripting.executeScript(
      {
        target: { tabId: tabs.id },
        world: "MAIN", // MAIN in order to access the window object
        func: setLocalStorageValue,
        args: [result.localStorageKey, info.menuItemId]
      }
    )
  });
});
