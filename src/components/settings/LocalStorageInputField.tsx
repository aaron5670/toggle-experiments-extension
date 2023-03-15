import { TextInput } from "@mantine/core";
import useStore from "~store/useStore";

const broadcastChannel = new BroadcastChannel("broadcastChannel");

const LocalStorageField = () => {
  const { localStorageKey, setLocalStorageKey, historyItems } = useStore(state => state);

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
      label="LocalStorage key"
      description="Default value: optimizelyNonLoggedInUser"
      value={localStorageKey}
      onChange={(e) => handleChange(e.target.value)}
      mb="lg"
    />
  );
};

export default LocalStorageField;
