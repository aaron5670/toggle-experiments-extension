import { TextInput } from "@mantine/core";
import useStore from "~store/useStore";

const LocalStorageField = () => {
  const { localStorageKey, setLocalStorageKey } = useStore(state => state);

  return (
    <TextInput
      label="LocalStorage key"
      description="Default value: optimizelyNonLoggedInUser"
      value={localStorageKey}
      onChange={(e) => setLocalStorageKey(e.target.value)}
      mb="lg"
    />
  );
};

export default LocalStorageField;
