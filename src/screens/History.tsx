import { useEffect, useState } from "react";
import Header from "~components/Header";
import { Anchor, Card, Center, Button, Container } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Storage } from "@plasmohq/storage";
import useStore from "~store/useStore";

import { HistoryItems } from "~components/HistoryItems";

const storage = new Storage();

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const { localStorageValue } = useStore(state => state);

  useEffect(() => {
    const load = async () => {
      const historyLocalStorage = await storage.get("history");
      if (historyLocalStorage) {
        const historyItemArray = JSON.parse(historyLocalStorage);
        if (historyItemArray?.length > 0) {
          setHistoryItems(historyItemArray);
        }
      }
    };
    load();
  }, []);

  const clearHistory = async (e) => {
    e.preventDefault();
    setHistoryItems([]);
    await storage.remove("history");
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
        <Center>
          <Anchor href="https://github.com/aaron5670/toggle-experiments-extension" target="_blank" mt="md">
            GitHub
          </Anchor>
        </Center>
      </Card>
    </>
  );
};


export default History;
