import { Anchor, Card, Center, TextInput } from "@mantine/core";
import useStore from "~store/useStore";
import Header from "~components/Header";

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
      <Center>
        <Anchor href="https://github.com/aaron5670/toggle-experiments-extension" target="_blank" mt="md">
          GitHub
        </Anchor>
      </Center>
    </Card>
  );
};

export default SettingsScreen;
