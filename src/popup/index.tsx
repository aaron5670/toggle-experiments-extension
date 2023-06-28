import getInitialLocalStorageData from "~utils/getInitialLocalStorageData";
import { MantineThemeOverride, MantineProvider } from "@mantine/core";
import versionUpdateChecker from "~utils/versionUpdateChecker";
import SearchExperiments from "~screens/SearchExperiments";
import ConnectOptimizely from "~screens/ConnectOptimizely";
import { Notifications } from "@mantine/notifications";
import SearchFeatures from "~screens/SearchFeatures";
import LatestRelease from "~screens/LatestRelease";
import React, { useEffect } from "react";
import Settings from "~screens/Settings";
import HomeScreen from "~screens/Home";
import History from "~screens/History";
import useStore from "~store/useStore";

const broadcastChannel = new BroadcastChannel("broadcastChannel");

function IndexPopup() {
  const {
    screen,
    setDefaultScreen,
    setHistoryItems,
    setLocalStorageKey,
    setLocalStorageValue,
    setOptimizelyAccessToken,
    setOptimizelyProjectId,
    setScreen
  } = useStore(state => state);

  useEffect(() => {
    const setInitialData = async () => {
      const {
        defaultScreen,
        history,
        key,
        optimizelyAccessToken,
        optimizelyProjectId,
        value
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
    colorScheme: "light",
    defaultGradient: { deg: 45, from: "red", to: "orange" },
    primaryColor: "red"
  };

  const blueTheme: MantineThemeOverride = {
    colorScheme: "light",
    defaultGradient: { deg: 45, from: "blue", to: "cyan" },
    primaryColor: "blue"
  };
  console.log(screen);

  return (
    <MantineProvider theme={screen === "search-features" ? redTheme : blueTheme} withGlobalStyles withNormalizeCSS>
      <Notifications style={{ cursor: "pointer" }} position="top-center" />
      <div style={{ width: 375 }}>
        {screen === "home" && <HomeScreen />}
        {screen === "history" && <History />}
        {screen === "settings" && <Settings />}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-expect-error => "search" is @deprecated */}
        {(screen === "search-experiments" || screen === "search") && <SearchExperiments />}
        {screen === "search-features" && <SearchFeatures />}
        {screen === "connect-optimizely" && <ConnectOptimizely />}
        {screen === "latest-release" && <LatestRelease />}
      </div>
    </MantineProvider>
  );
}

export default IndexPopup;
