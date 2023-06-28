import { SegmentedControl, Text } from "@mantine/core";
import useStore from "~store/useStore";
import React from "react";

const DefaultScreenSegmentField = () => {
  const { defaultScreen, setDefaultScreen } = useStore(state => state);

  return (
    <>
      <Text size={14}>
        Default screen
      </Text>
      <SegmentedControl
        data={[
          { label: 'Home', value: 'home' },
          { label: 'Experiments', value: 'search-experiments' },
          { label: 'Features', value: 'search-features' },
          { label: 'History', value: 'history' },
        ]}
        defaultValue={defaultScreen}
        onChange={setDefaultScreen}
        value={defaultScreen}
        radius="md"
        fullWidth
        mb="lg"
      />
    </>
  );
};

export default DefaultScreenSegmentField;
