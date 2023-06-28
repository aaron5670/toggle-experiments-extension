import { ActionIcon, Group, Text } from "@mantine/core";
import { IconAdjustments, IconSearch, IconHome, IconHistory } from "@tabler/icons-react";
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
        <Group position="right" spacing={3}>
          <ActionIcon
            variant={screen === "home" ? "gradient" : "light"}
            onClick={() => setScreen("home")}
          >
            <IconHome />
          </ActionIcon>
          <ActionIcon
            variant={screen === "history" ? "gradient" : "light"}
            onClick={() => setScreen("history")}
          >
            <IconHistory />
          </ActionIcon>
          <ActionIcon
            variant={screen === "search-experiments" || screen === "search-features" ? "gradient" : "light"}
            onClick={() => setScreen("search-experiments")}
          >
            <IconSearch />
          </ActionIcon>
          <ActionIcon
            variant={screen === "settings" ? "gradient" : "light"}
            onClick={() => setScreen("settings")}
          >
            <IconAdjustments />
          </ActionIcon>
        </Group>
      </Group>
      <Text size="xs" color="dimmed"  mb="xl">
        {description}
      </Text>
    </>
  );
};

export default Header;
