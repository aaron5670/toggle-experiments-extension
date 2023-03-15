import { ActionIcon, Card, Grid, TextInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import {
  getCurrentLocalStorageValue,
  removeLocalStorageValue,
  updateLocalStorageValue
} from "~handlers/localStorageHandlers";
import useStore from "~store/useStore";
import SaveButton from "~components/SaveButton";
import Header from "~components/Header";
import { useEffect } from "react";

function IndexPopup() {
  const { localStorageKey, localStorageValue, setLocalStorageValue } = useStore(state => state);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const [localStorage] = await getCurrentLocalStorageValue(tabs[0].id, localStorageKey);
      if (localStorage?.result) {
        setLocalStorageValue(localStorage.result);
      }
    });
  }, [localStorageKey]);

  const saveToLocalStorage = (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateLocalStorageValue(tabs[0].id, localStorageKey, localStorageValue);
    });
  };

  const removeLocalStorage = (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setLocalStorageValue("");
      removeLocalStorageValue(tabs[0].id, localStorageKey);
    });
  };

  return (
    <Card p="lg" radius="md">
      <Header
        title="Toggle Optimizely"
        description={`Current LocalStorage key: ${localStorageKey}`}
      />
      <form onSubmit={saveToLocalStorage}>
        <Grid>
          <Grid.Col span={10}>
            <TextInput
              placeholder="exp123-variant"
              label="LocalStorage value"
              radius="xl"
              value={localStorageValue}
              onChange={(e) => setLocalStorageValue(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <ActionIcon variant="light" onClick={removeLocalStorage} style={{marginTop: 19}}>
              <IconTrash size={20} color="red" />
            </ActionIcon>
          </Grid.Col>
        </Grid>
        <SaveButton text="Save to LocalStorage" />
      </form>
    </Card>
  );
}

export default IndexPopup;
