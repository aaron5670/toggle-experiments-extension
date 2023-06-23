import { useEffect } from "react";
import useStore from "~store/useStore";
import HomeScreen from "~screens/Home";
import History from "~screens/History";
import Settings from "~screens/Settings";
import Search from "~screens/Search";
import ConnectOptimizely from "~screens/ConnectOptimizely";
import LatestRelease from "~screens/LatestRelease";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import getInitialLocalStorageData from "~utils/getInitialLocalStorageData";
import versionUpdateChecker from "~utils/versionUpdateChecker";

const broadcastChannel = new BroadcastChannel("broadcastChannel");

function IndexPopup() {
  const {
    setLocalStorageValue,
    screen,
    setLocalStorageKey,
    setOptimizelyAccessToken,
    setOptimizelyProjectId,
    setScreen,
    setHistoryItems
  } = useStore(state => state);

  useEffect(() => {
    const setInitialData = async () => {
      const {
        key,
        history,
        optimizelyProjectId,
        optimizelyAccessToken,
        value,
        defaultScreen,
      } = await getInitialLocalStorageData();

      setLocalStorageKey(key ?? "optimizelyNonLoggedInUser");
      setLocalStorageValue(value ?? "");
      setOptimizelyAccessToken(optimizelyAccessToken ?? "");
      setOptimizelyProjectId(optimizelyProjectId ?? null);
      setScreen(defaultScreen ?? "home");
      // setScreen("latest-release");
      setHistoryItems(history ? JSON.parse(history) : []);

      await versionUpdateChecker(setScreen);

      // Broadcast history and localStorageKey to service worker
      broadcastChannel.postMessage({
        history: history ? JSON.parse(history) : null,
        localStorageKey: key ?? "optimizelyNonLoggedInUser"
      });
    };
    setInitialData();
  }, []);

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <Notifications position="top-center" style={{cursor: "pointer"}} />
      <div style={{ width: 350 }}>
        {screen === "home" && <HomeScreen />}
        {screen === "history" && <History />}
        {screen === "settings" && <Settings />}
        {screen === "search" && <Search />}
        {screen === "connect-optimizely" && <ConnectOptimizely />}
        {screen === "latest-release" && <LatestRelease />}
      </div>
    </MantineProvider>
  );
}

export default IndexPopup;
