import { useEffect } from "react";
import useStore from "~store/useStore";
import HomeScreen from "~screens/Home";
import History from "~screens/History";
import Settings from "~screens/Settings";
import SearchExperiments from "~screens/SearchExperiments";
import SearchFeatures from "~screens/SearchFeatures";
import ConnectOptimizely from "~screens/ConnectOptimizely";
import LatestRelease from "~screens/LatestRelease";
import { MantineProvider, MantineThemeOverride } from "@mantine/core";
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
    setDefaultScreen,
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
        defaultScreen
      } = await getInitialLocalStorageData();

      setLocalStorageKey(key ?? "optimizelyNonLoggedInUser");
      setLocalStorageValue(value ?? "");
      setOptimizelyAccessToken(optimizelyAccessToken ?? "");
      setOptimizelyProjectId(optimizelyProjectId ?? null);
      setScreen(defaultScreen ?? "home");
      setDefaultScreen(defaultScreen ?? "home");
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

  const redTheme: MantineThemeOverride = {
    defaultGradient: { from: "red", to: "orange", deg: 45 },
    colorScheme: "light",
    primaryColor: "red"
  };

  const blueTheme: MantineThemeOverride = {
    defaultGradient: { from: "blue", to: "cyan", deg: 45 },
    colorScheme: "light",
    primaryColor: "blue"
  };

  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={screen === "search-features" ? redTheme : blueTheme}>
      <Notifications position="top-center" style={{ cursor: "pointer" }} />
      <div style={{ width: 375 }}>
        {screen === "home" && <HomeScreen />}
        {screen === "history" && <History />}
        {screen === "settings" && <Settings />}
        {screen === "search-experiments" && <SearchExperiments />}
        {screen === "search-features" && <SearchFeatures />}
        {screen === "connect-optimizely" && <ConnectOptimizely />}
        {screen === "latest-release" && <LatestRelease />}
      </div>
    </MantineProvider>
  );
}

export default IndexPopup;
