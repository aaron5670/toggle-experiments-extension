import DefaultScreenSegmentField from "~components/settings/DefaultScreenSegmentField";
import LocalStorageField from "~components/settings/LocalStorageInputField";
import { Center, Button, Anchor, Group, Text, Card } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import Header from "~components/Header";
import useStore from "~store/useStore";
import React from "react";

const manifestData = chrome.runtime.getManifest();

const Settings = () => {
  const { setScreen } = useStore(state => state);

  return (
    <Card radius="md" p="lg">
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
