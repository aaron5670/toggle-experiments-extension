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
        defaultValue={defaultScreen}
        data={[
          { label: 'Home', value: 'home' },
          { label: 'Experiments', value: 'search-experiments' },
          { label: 'Features', value: 'search-features' },
          { label: 'History', value: 'history' },
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
