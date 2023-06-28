import { IconAdjustments, IconHistory, IconSearch, IconHome } from "@tabler/icons-react";
import { ActionIcon, Group, Text } from "@mantine/core";
import useStore from "~store/useStore";
import React from "react";

interface HeaderProps {
  description?: string;
  title: string;
}

const Header = ({ description = "", title }: HeaderProps) => {
  const { screen, setScreen } = useStore(state => state);

  return (
    <>
      <Group position="apart">
        <Text
          sx={{ fontFamily: "Greycliff CF, sans-serif" }}
          variant="gradient"
          ta="center"
          fw={700}
          fz="xl"
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
      <Text color="dimmed" size="xs"  mb="xl">
        {description}
      </Text>
    </>
  );
};

export default Header;
