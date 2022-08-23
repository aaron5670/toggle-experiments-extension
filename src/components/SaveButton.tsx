import { Button } from "@mantine/core";
import { IconCopy } from "@tabler/icons";

const SaveButton = ({ text }: { text: string }) => {
  return (
      <Button
        variant="light"
        rightIcon={<IconCopy size={20} stroke={1.5} />}
        radius="xl"
        size="md"
        mt="md"
        styles={{
          root: { paddingRight: 14, height: 48 },
          rightIcon: { marginLeft: 22 }
        }}
        type="submit"
        fullWidth
      >
        {text}
      </Button>
  );
};

export default SaveButton;
