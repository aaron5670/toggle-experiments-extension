import { Box, Button, Card, Collapse, createStyles, Divider, Group, Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from "~store/useStore";
import { updateLocalStorageValue } from "~handlers/localStorageHandlers";

const useStyles = createStyles(() => ({
  card: {
    ':hover': {
      transition: 'background-color 150ms ease',
      backgroundColor: '#f0f0f0',
    },
  },
}));

interface SearchItemProps {
  experiment: {
    id: string;
    name: string;
    description: string;
  };
}

const SearchItem = ({ experiment }: SearchItemProps) => {
  const { classes } = useStyles();
  const { localStorageKey, setLocalStorageValue, optimizelyAccessToken } = useStore(state => state);
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

  const saveToLocalStorage = (value) => {
    setLocalStorageValue(value);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateLocalStorageValue(tabs[0].id, localStorageKey, value);
    });
  };

  return (
    <Card
      key={experiment.id}
      shadow="sm" p="xs" mb="xs" radius="md"
      onClick={() => setOpened(true)}
      className={classes.card}
      style={{ cursor: "pointer" }}
    >
      <Text weight={500}>{experiment.name}</Text>
      <Text size="sm" color="dimmed">
        {experiment.description}
      </Text>

      <Collapse in={opened}>
        {loading ? (<Group position="center" my="md"><Loader /></Group>) : (
          <Box my="md">
            <Divider my="sm" variant="dashed" />
            <Text weight={500}>Whitelisted users</Text>
            <Button.Group orientation="vertical">
              {experimentData?.whitelist.map((item) => (
                <Button
                  variant="default"
                  key={item.user_id}
                  onClick={() => saveToLocalStorage(item.user_id)}
                >{item.user_id}</Button>
              ))}
            </Button.Group>
          </Box>
        )}
        {error && (
          <Text size="sm" mt="md" c="red" ta="center">
            {error}
          </Text>
        )}
      </Collapse>
    </Card>
  );
};

export default SearchItem;
