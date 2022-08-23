import { Card } from "@mantine/core";
import useStore from "~store/useStore";
import SaveButton from "~components/SaveButton";
import FloatingLabelInput from "~components/FloatingLabelInput";
import localStorageInjector from "~local-storage-injector";
import Header from "~components/Header";

const inject = async (tabId, localStorageKey, localStorageValue) => {
  await chrome.scripting.executeScript(
    {
      target: { tabId },
      world: "MAIN", // MAIN in order to access the window object
      func: localStorageInjector,
      args: [localStorageKey, localStorageValue]
    }
  );
};

function IndexPopup() {
  const { localStorageKey, localStorageValue, setLocalStorageValue } = useStore(state => state);

  const saveToLocalStorage = (e) => {
    e.preventDefault();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      inject(tabs[0].id, localStorageKey, localStorageValue);
    });
  };

  return (
    <Card p="lg" radius="md">
      <Header
        title="Toggle Optimizely"
        description={`Current LocalStorage key: ${localStorageKey}`}
      />
      <form onSubmit={saveToLocalStorage}>
        <FloatingLabelInput
          label="Optimizely username"
          value={localStorageValue}
          onChange={setLocalStorageValue}
        />
        <SaveButton text="Save to LocalStorage" />
      </form>
    </Card>
  );
}

export default IndexPopup;
