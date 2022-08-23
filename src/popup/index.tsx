import { useEffect } from "react";
import { Storage } from "@plasmohq/storage"
import useStore from "~store/useStore";
import HomeScreen from "~screens/HomeScreen";
import SettingsScreen from "~screens/SettingsScreen";

const storage = new Storage()

function IndexPopup() {
  const {setLocalStorageValue, screen, setLocalStorageKey} = useStore(state => state);

  useEffect(() => {
    const load = async () => {
      const key = await storage.get("localStorageKey");
      const value = await storage.get("localStorageValue");
      setLocalStorageKey(key ?? "optimizelyNonLoggedInUser");
      setLocalStorageValue(value ?? "");
    }
    load();
  }, []);

  return (
    <div style={{width: 300}}>
      {screen === "home" && <HomeScreen />}
      {screen === "settings" && <SettingsScreen />}
    </div>
  );
}

export default IndexPopup;
