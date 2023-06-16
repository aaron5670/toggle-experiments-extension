import { notifications } from "@mantine/notifications";
import type { Screen } from "~types/types";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

const versionUpdateChecker = async (setScreen: (screen: Screen) => void) => {
  const savedVersion = await storage.get("extensionVersion");
  const currentVersion = chrome.runtime.getManifest().version;

  if (savedVersion === currentVersion) return;

  // If the savedVersion is not the current version, then it means that the user has updated the extension.
  await storage.set("extensionVersion", currentVersion);

  // Show a notification to the user that a new version is released.
  notifications.show({
    id: "new-version-release",
    title: "A new version is released! 🎉",
    message: "Click on this notification to see what's new in this version.",
    color: "pink",
    autoClose: false,
    onClick: () => {
      setScreen("latest-release");
      notifications.hide("new-version-release");
    }
  });
};

export default versionUpdateChecker;
