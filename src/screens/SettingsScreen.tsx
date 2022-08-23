import { Card, TextInput } from "@mantine/core";
import Header from "~components/Header";
import useStore from "~store/useStore";

const SettingsScreen = () => {
  const { localStorageKey, setLocalStorageKey } = useStore(state => state);

  return (
    <Card p="lg" radius="md">
      <Header
        title="Settings"
        description="Change the settings for LocalStorage in this section."
      />
      <TextInput
        label="LocalStorage key"
        description="Default value: optimizelyNonLoggedInUser"
        value={localStorageKey}
        onChange={(e) => setLocalStorageKey(e.target.value)}
      />
    </Card>
  );
};

export default SettingsScreen;
