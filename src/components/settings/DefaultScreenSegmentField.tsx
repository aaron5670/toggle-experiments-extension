import { SegmentedControl, Text } from "@mantine/core";
import useStore from "~store/useStore";

const DefaultScreenSegmentField = () => {
  const { defaultScreen, setDefaultScreen } = useStore(state => state);

  return (
    <>
      <Text size={14}>
        Default screen
      </Text>
      <SegmentedControl
        value={defaultScreen}
        data={[
          { label: 'Home', value: 'home' },
          { label: 'History', value: 'history' },
          { label: 'Search', value: 'search' },
          { label: 'Settings', value: 'settings' },
        ]}
        onChange={setDefaultScreen}
        radius="md"
        mb="lg"
        fullWidth
      />
    </>
  );
};

export default DefaultScreenSegmentField;
