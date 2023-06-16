import { Storage } from "@plasmohq/storage";
import type { Screen } from "~types/types";

const storage = new Storage();

const getInitialLocalStorageData = async () => {
  const key = await storage.get("localStorageKey");
  const value = await storage.get("localStorageValue");
  const defaultScreen = await storage.get<Screen | null>("defaultScreen");
  const optimizelyAccessToken = await storage.get("optimizelyAccessToken");
  const optimizelyProjectId = await storage.get("optimizelyProjectId");
  const history = await storage.get("history");

  return {
    key,
    value,
    defaultScreen,
    optimizelyAccessToken,
    optimizelyProjectId,
    history,
  };
};

export default getInitialLocalStorageData;
