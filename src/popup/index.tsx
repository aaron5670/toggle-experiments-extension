import { useEffect } from "react";
import { Storage } from "@plasmohq/storage"
import useStore from "~store/useStore";
import HomeScreen from "~screens/Home";
import History from "~screens/History"
import Settings from "~screens/Settings";
import Search from "~screens/Search";
import type { Screen } from "~types/types";
import ConnectOptimizely from "~screens/ConnectOptimizely";

const storage = new Storage()

function IndexPopup() {
  const {setLocalStorageValue, screen, setLocalStorageKey, setOptimizelyAccessToken, setOptimizelyProjectId, setScreen} = useStore(state => state);

  useEffect(() => {
    const load = async () => {
      const key = await storage.get("localStorageKey");
      const value = await storage.get("localStorageValue");
      const defaultScreen = await storage.get<Screen | null>("defaultScreen");
      const optimizelyAccessToken = await storage.get("optimizelyAccessToken");
      const optimizelyProjectId = await storage.get("optimizelyProjectId");
      setLocalStorageKey(key ?? "optimizelyNonLoggedInUser");
      setLocalStorageValue(value ?? "");
      setOptimizelyAccessToken(optimizelyAccessToken ?? "");
      setOptimizelyProjectId(optimizelyProjectId ?? null);
      setScreen(defaultScreen ?? "home");
    }
    load();
  }, []);

  return (
    <div style={{width: 350}}>
      {screen === "home" && <HomeScreen />}
      {screen === "history" && <History />}
      {screen === "settings" && <Settings />}
      {screen === "search" && <Search />}
      {screen === "connect-optimizely" && <ConnectOptimizely />}
    </div>
  );
}

export default IndexPopup;
