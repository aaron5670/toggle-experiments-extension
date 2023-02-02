import { ActionIcon, Group, Text } from "@mantine/core";
import { IconAdjustments, IconSearch, IconX, IconHistory } from "@tabler/icons-react";
import useStore from "~store/useStore";

interface HeaderProps {
  title: string;
  description?: string;
}

const Header = ({ title, description = "" }: HeaderProps) => {
  const { screen, setScreen } = useStore(state => state);

  return (
    <>
      <Group position="apart">
        <Text
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          ta="center"
          fz="xl"
          fw={700}
        >
          {title}
        </Text>
        <Group position="right" spacing={1}>
          <ActionIcon
            onClick={() => setScreen(screen === "history" ? "home" : "history")}
          >
            {screen === "history" ? (<IconX />) : (<IconHistory />)}
          </ActionIcon>
          <ActionIcon
            onClick={() => setScreen(screen === "search" ? "home" : "search")}
          >
            {screen === "search" ? (<IconX />) : (<IconSearch />)}
          </ActionIcon>
          <ActionIcon
            onClick={() => setScreen(screen === "settings" ? "home" : "settings")}
          >
            <IconAdjustments />
          </ActionIcon>
        </Group>
      </Group>
      <Text size="xs" color="dimmed" mt="md"  mb="xl">
        {description}
      </Text>
    </>
  );
};

export default Header;
