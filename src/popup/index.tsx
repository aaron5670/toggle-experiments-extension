import { useEffect } from "react";
import { Storage } from "@plasmohq/storage"
import useStore from "~store/useStore";
import HomeScreen from "~screens/Home";
import Settings from "~screens/Settings";
import Search from "~screens/Search";
import type { Screen } from "~types/types";

const storage = new Storage()

function IndexPopup() {
  const {setLocalStorageValue, screen, setLocalStorageKey, setOptimizelyAccessToken, setScreen} = useStore(state => state);

  useEffect(() => {
    const load = async () => {
      const key = await storage.get("localStorageKey");
      const value = await storage.get("localStorageValue");
      const defaultScreen = await storage.get<Screen | null>("defaultScreen");
      const optimizelyAccessToken = await storage.get("optimizelyAccessToken");
      setLocalStorageKey(key ?? "optimizelyNonLoggedInUser");
      setLocalStorageValue(value ?? "");
      setOptimizelyAccessToken(optimizelyAccessToken ?? "");
      setScreen(defaultScreen ?? "home");
    }
    load();
  }, []);

  return (
    <div style={{width: 300}}>
      {screen === "home" && <HomeScreen />}
      {screen === "settings" && <Settings />}
      {screen === "search" && <Search />}
    </div>
  );
}

export default IndexPopup;
