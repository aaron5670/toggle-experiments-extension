import { TextInput } from "@mantine/core";
import useStore from "~store/useStore";
import React from "react";

const broadcastChannel = new BroadcastChannel("broadcastChannel");

const LocalStorageField = () => {
  const { historyItems, localStorageKey, setLocalStorageKey } = useStore(state => state);

  const handleChange = (value) => {
    setLocalStorageKey(value)

    // Broadcast localStorageKey to service worker
    broadcastChannel.postMessage({
      history: historyItems,
      localStorageKey: value,
    });
  }

  return (
    <TextInput
      description="Default value: optimizelyNonLoggedInUser"
      onChange={(e) => handleChange(e.target.value)}
      label="LocalStorage key"
      value={localStorageKey}
      mb="lg"
    />
  );
};

export default LocalStorageField;
