import { useEffect, useState } from "react";
import { Anchor, Avatar, Box, Button, Collapse, createStyles, Divider, Group, Loader, Text } from "@mantine/core";
import { IconPlayerPlay, IconPlayerPause, IconPencil, IconQuestionMark, IconExternalLink } from "@tabler/icons-react";
import useStore from "~store/useStore";
import { updateLocalStorageValue } from "~handlers/localStorageHandlers";
import { Storage } from "@plasmohq/storage";
import type { HistoryItems } from "~types/types";

const broadcastChannel = new BroadcastChannel("broadcastChannel");

const useStyles = createStyles((theme) => ({
  card: {
    cursor: "pointer",
    ":hover": {
      transition: "background-color 150ms ease",
      backgroundColor: "#f0f0f0"
    }
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

interface SearchItemProps {
  experiment: {
    project_id: string;
    status: string;
    id: string;
    name: string;
    description: string;
  };
}

const storage = new Storage();

const SearchItem = ({ experiment }: SearchItemProps) => {
  const { classes } = useStyles();
  const { localStorageKey, setLocalStorageValue, optimizelyAccessToken, setHistoryItems } = useStore(state => state);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [experimentData, setExperimentData] = useState(null);

  useEffect(() => {
    const fetchExperiment = async () => {
      if (opened) {
        try {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/experiments/${experiment.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            }
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

  console.log(experimentData);

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
    addHistoryItem({ name: experimentName, key: value });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateLocalStorageValue(tabs[0].id, localStorageKey, value);
    });
  };

  const getStatus = (status) => {
    switch (status) {
      case "running":
        return {
          name: "Running",
          color: "green",
          icon: <IconPlayerPlay size={18} stroke={1.5} />
        };
      case "paused":
        return {
          name: "Paused",
          color: "yellow",
          icon: <IconPlayerPause size={18} stroke={1.5} />
        };
      case "not_started":
        return {
          name: "Not Started",
          color: "gray",
          icon: <IconPencil size={18} stroke={1.5} />
        };
      default:
        return {
          name: "Unknown",
          color: "gray",
          icon: <IconQuestionMark size={18} stroke={1.5} />
        };
    }
  };

  const status = getStatus(experiment?.status);

  return (
    <>
      <Group className={classes.card} py="sm" onClick={() => setOpened(true)} noWrap>
        <Avatar size={40} color={status.color}>{status.icon}</Avatar>
        <Text size="sm" weight={500} className={classes.name}>
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
                <Text size="xs" weight={500} color={status.color}>
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
                  <IconExternalLink size={18} stroke={1.5} style={{ marginBottom: -4 }} /> Optimizely
                </Anchor>
              </Text>
            </Group>
            <Text size="xs" color="dimmed">
              {experiment?.description}
            </Text>
            <Divider my="md" />
            <Text weight={500} mb="xs">Whitelisted users</Text>
            <Button.Group orientation="vertical">
              {experimentData?.whitelist ? experimentData?.whitelist?.map((item) => (
                <Button
                  variant="default"
                  key={item.user_id}
                  onClick={() => saveToLocalStorage(item.user_id, experiment.name)}
                >
                  {item.user_id}
                </Button>
              )) : (
                <Text size="xs" color="dimmed">
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
          <Text size="sm" mt="md" c="red" ta="center">
            {error}
          </Text>
        )}
      </Collapse>
    </>
  );
};

export default SearchItem;
