import { Anchor, Button, Card, Center } from "@mantine/core";
import Header from "~components/Header";
import LocalStorageField from "~components/settings/LocalStorageInputField";
import DefaultScreenSegmentField from "~components/settings/DefaultScreenSegmentField";
import useStore from "~store/useStore";
import { IconDatabase } from "@tabler/icons-react";

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
      <Center>
        <Anchor href="https://github.com/aaron5670/toggle-experiments-extension" target="_blank" mt="md">
          GitHub
        </Anchor>
      </Center>
    </Card>
  );
};

export default Settings;
