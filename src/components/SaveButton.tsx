import { IconCopy } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import React from "react";

const SaveButton = ({ text }: { text: string }) => {
  return (
      <Button
        styles={{
          rightIcon: { marginLeft: 22 },
          root: { height: 48, paddingRight: 14 }
        }}
        rightIcon={<IconCopy stroke={1.5} size={20} />}
        variant="light"
        type="submit"
        radius="xl"
        size="md"
        fullWidth
        mt="md"
      >
        {text}
      </Button>
  );
};

export default SaveButton;
