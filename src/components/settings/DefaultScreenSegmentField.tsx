import { createStyles, SegmentedControl, Text } from "@mantine/core";
import useStore from "~store/useStore";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.md,
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1]
    }`,
  },
  active: {
    backgroundImage: theme.fn.gradient({ from: 'indigo', to: 'cyan' }),
  },
  control: {
    border: '0 !important',
  },
  labelActive: {
    color: `${theme.white} !important`,
  },
}));

const DefaultScreenSegmentField = () => {
  const { defaultScreen, setDefaultScreen } = useStore(state => state);
  const { classes } = useStyles();

  return (
    <>
      <Text size={14}>
        Default screen
      </Text>
      <SegmentedControl
        value={defaultScreen}
        data={[
          { label: 'Home', value: 'home' },
          { label: 'Search', value: 'search' },
          { label: 'Settings', value: 'settings' },
        ]}
        onChange={setDefaultScreen}
        classNames={classes}
        radius="md"
        mb="lg"
        fullWidth
      />
    </>
  );
};

export default DefaultScreenSegmentField;
