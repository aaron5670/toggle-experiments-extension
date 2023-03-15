import Header from "~components/Header";
import { Card, Center, Button, Container } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Storage } from "@plasmohq/storage";
import useStore from "~store/useStore";

import { HistoryItems } from "~components/HistoryItems";

const storage = new Storage();
const broadcastChannel = new BroadcastChannel('broadcastChannel');

const History = () => {
  const { localStorageValue, historyItems, setHistoryItems } = useStore(state => state);

  const clearHistory = async (e) => {
    e.preventDefault();
    setHistoryItems([]);
    await storage.remove("history");

    // broadcast to service worker
    broadcastChannel.postMessage({ history: null });
  };

  return (
    <>
      <Card p="lg" radius="md">
        <Header title="History" />
        <HistoryItems links={historyItems} active={localStorageValue} />
        <Container size="xs" py="sm" px={0}>
          <Center>
            <Button
              variant="default"
              leftIcon={<IconTrash size="14" />}
              sx={(theme) => ({
                fontSize: theme.fontSizes.sm,
                fontWeight: "normal"
              })}
              onClick={(e) => clearHistory(e)}
            >
              Clear history
            </Button>
          </Center>
        </Container>
      </Card>
    </>
  );
};


export default History;
