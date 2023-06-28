import type { HistoryItems } from "~types/types";

import { IconQuestionMark, IconExternalLink, IconPlayerPause, IconPlayerPlay, IconPencil } from "@tabler/icons-react";
import { createStyles, Collapse, Divider, Loader, Button, Avatar, Anchor, Group, Text, Box } from "@mantine/core";
import { updateLocalStorageValue } from "~handlers/localStorageHandlers";
import React, { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import useStore from "~store/useStore";

const broadcastChannel = new BroadcastChannel("broadcastChannel");

const useStyles = createStyles((theme) => ({
  card: {
    ":hover": {
      backgroundColor: "#f0f0f0",
      transition: "background-color 150ms ease"
    },
    cursor: "pointer"
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

interface ExperimentItemProps {
  experiment: {
    description: string;
    project_id: string;
    status: string;
    name: string;
    id: string;
  };
}

const storage = new Storage();

const ExperimentItem = ({ experiment }: ExperimentItemProps) => {
  const { classes } = useStyles();
  const { localStorageKey, optimizelyAccessToken, setHistoryItems, setLocalStorageValue } = useStore(state => state);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [experimentData, setExperimentData] = useState(null);

  useEffect(() => {
    const fetchExperiment = async () => {
      if (opened) {
        try {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/experiments/${experiment.id}`, {
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            },
            method: "GET"
          });
          const data = await response.json();
          setExperimentData(data);
        } catch (error) {
          console.error(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExperiment();
  }, [opened]);

  const addHistoryItem = async (newItem: HistoryItems) => {
    const maxHistoryItems = 3;
    const historyItemsLocalStorage = await storage.get("history");
    const newHistoryItems = historyItemsLocalStorage ? JSON.parse(historyItemsLocalStorage) : [];

    if (newHistoryItems.find((item: { key: string; }) => item.key === newItem.key)) {
      return;
    }

    if (newHistoryItems.length >= maxHistoryItems) {
      newHistoryItems.shift();
    }

    newHistoryItems.push(newItem);
    setHistoryItems(newHistoryItems);

    // Broadcast history to service worker
    broadcastChannel.postMessage({ history: newHistoryItems });
  };

  const saveToLocalStorage = (value, experimentName) => {
    setLocalStorageValue(value);
    addHistoryItem({ key: value, name: experimentName });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateLocalStorageValue(tabs[0].id, localStorageKey, value);
    });
  };

  const getStatus = (status) => {
    switch (status) {
      case "running":
        return {
          color: "green",
          icon: <IconPlayerPlay stroke={1.5} size={18} />,
          name: "Running"
        };
      case "paused":
        return {
          color: "yellow",
          icon: <IconPlayerPause stroke={1.5} size={18} />,
          name: "Paused"
        };
      case "not_started":
        return {
          color: "gray",
          icon: <IconPencil stroke={1.5} size={18} />,
          name: "Not Started"
        };
      default:
        return {
          color: "gray",
          icon: <IconQuestionMark stroke={1.5} size={18} />,
          name: "Unknown"
        };
    }
  };

  const status = getStatus(experiment?.status);

  return (
    <>
      <Group onClick={() => setOpened(true)} className={classes.card} py="sm" noWrap>
        <Avatar color={status.color} size={40}>{status.icon}</Avatar>
        <Text className={classes.name} weight={500} size="sm">
          {experiment.name}
        </Text>
      </Group>
      <Collapse in={opened}>
        {loading ? (<Group position="center" my="md"><Loader /></Group>) : (
          <Box mb="md">
            <Group position="apart" my="xs">
              <Group position="left">
                <Text size="xs" fw={500}>
                  Status:
                </Text>
                <Text color={status.color} weight={500} size="xs">
                  {status.name}
                </Text>
                <Text size="xs">
                 {experimentData?.traffic_allocation / 100}% traffic
                </Text>
              </Group>
              <Text size="xs">
                <Anchor
                  href={`https://app.optimizely.com/v2/projects/${experiment.project_id}/experiments/${experiment.id}`}
                  target="_blank">
                  <IconExternalLink style={{ marginBottom: -4 }} stroke={1.5} size={18} /> Optimizely
                </Anchor>
              </Text>
            </Group>
            <Text color="dimmed" size="xs">
              {experiment?.description}
            </Text>
            <Divider my="md" />
            <Text weight={500} mb="xs">Whitelisted users</Text>
            <Button.Group orientation="vertical">
              {experimentData?.whitelist ? experimentData?.whitelist?.map((item) => (
                <Button
                  onClick={() => saveToLocalStorage(item.user_id, experiment.name)}
                  key={item.user_id}
                  variant="default"
                >
                  {item.user_id}
                </Button>
              )) : (
                <Text color="dimmed" size="xs">
                  No whitelisted users found. {" "}
                  <Anchor
                    href={`https://app.optimizely.com/v2/projects/${experiment.project_id}/experiments/${experiment.id}/whitelist`}
                    target="_blank">
                    Click here
                  </Anchor>
                  {" "}to add some whitelisted users in Optimizely.
                </Text>
              )}
            </Button.Group>
          </Box>
        )}
        {error && (
          <Text ta="center" size="sm" mt="md" c="red">
            {error}
          </Text>
        )}
      </Collapse>
    </>
  );
};

export default ExperimentItem;
