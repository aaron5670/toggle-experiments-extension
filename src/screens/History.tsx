import { Container, Center, Button, Card } from "@mantine/core";
import { HistoryItems } from "~components/HistoryItems";
import { IconTrash } from "@tabler/icons-react";
import { Storage } from "@plasmohq/storage";
import Header from "~components/Header";
import useStore from "~store/useStore";
import React from "react";

const storage = new Storage();
const broadcastChannel = new BroadcastChannel('broadcastChannel');

const History = () => {
  const { historyItems, localStorageValue, setHistoryItems } = useStore(state => state);

  const clearHistory = async (e) => {
    e.preventDefault();
    setHistoryItems([]);
    await storage.remove("history");

    // broadcast to service worker
    broadcastChannel.postMessage({ history: null });
  };

  return (
    <>
      <Card radius="md" p="lg">
        <Header title="History" />
        <HistoryItems active={localStorageValue} links={historyItems} />
        <Container size="xs" py="sm" px={0}>
          <Center>
            <Button
              sx={(theme) => ({
                fontSize: theme.fontSizes.sm,
                fontWeight: "normal"
              })}
              leftIcon={<IconTrash size="14" />}
              onClick={(e) => clearHistory(e)}
              variant="default"
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
