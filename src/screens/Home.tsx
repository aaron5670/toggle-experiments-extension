import {
  getCurrentLocalStorageValue,
  removeLocalStorageValue,
  updateLocalStorageValue
} from "~handlers/localStorageHandlers";
import { ActionIcon, TextInput, Grid, Card } from "@mantine/core";
import SaveButton from "~components/SaveButton";
import { IconTrash } from "@tabler/icons-react";
import Header from "~components/Header";
import useStore from "~store/useStore";
import { useEffect } from "react";
import React from "react";

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
    <Card radius="md" p="lg">
      <Header
        description={`Current LocalStorage key: ${localStorageKey}`}
        title="Toggle Optimizely"
      />
      <form onSubmit={saveToLocalStorage}>
        <Grid>
          <Grid.Col span={10}>
            <TextInput
              onChange={(e) => setLocalStorageValue(e.currentTarget.value)}
              placeholder="exp123-variant"
              label="LocalStorage value"
              value={localStorageValue}
              radius="xl"
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <ActionIcon onClick={removeLocalStorage} style={{marginTop: 19}} variant="light">
              <IconTrash color="red" size={20} />
            </ActionIcon>
          </Grid.Col>
        </Grid>
        <SaveButton text="Save to LocalStorage" />
      </form>
    </Card>
  );
}

export default IndexPopup;
