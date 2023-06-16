import { Text, Anchor, Button, Card, Center, Group } from "@mantine/core";
import Header from "~components/Header";
import LocalStorageField from "~components/settings/LocalStorageInputField";
import DefaultScreenSegmentField from "~components/settings/DefaultScreenSegmentField";
import useStore from "~store/useStore";
import { IconDatabase } from "@tabler/icons-react";

const manifestData = chrome.runtime.getManifest();

const Settings = () => {
  const { setScreen } = useStore(state => state);

  return (
    <Card p="lg" radius="md">
      <Header title="Settings" />
      <DefaultScreenSegmentField />
      <LocalStorageField />
      <Center>
        <Button
          onClick={() => setScreen("connect-optimizely")}
          leftIcon={<IconDatabase />}
          variant="gradient"
        >
          Connect to Optimizely
        </Button>
      </Center>
      <Group position="center">
        <Text fz="xs" mt="md">
          <Anchor href="https://github.com/aaron5670/toggle-experiments-extension" target="_blank" mt="md">
            GitHub
          </Anchor>
          {"  "}
          <Anchor href={`https://github.com/aaron5670/toggle-experiments-extension/releases/v${manifestData.version}`}
                  target="_blank" mt="md">
            v{manifestData.version}
          </Anchor>
        </Text>
      </Group>
    </Card>
  );
};

export default Settings;
