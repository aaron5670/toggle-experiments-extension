import { Anchor, Card, Center } from "@mantine/core";
import Header from "~components/Header";
import AccessTokenInputField from "~components/settings/AccessTokenInputField";
import LocalStorageField from "~components/settings/LocalStorageInputField";
import DefaultScreenSegmentField from "~components/settings/DefaultScreenSegmentField";

const Settings = () => (
  <Card p="lg" radius="md">
    <Header title="Settings" />
    <DefaultScreenSegmentField />
    <LocalStorageField />
    <AccessTokenInputField />
    <Center>
      <Anchor href="https://github.com/aaron5670/toggle-experiments-extension" target="_blank" mt="md">
        GitHub
      </Anchor>
    </Center>
  </Card>
);

export default Settings;
