import { Anchor, Card, Flex, Loader, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import useStore from "~store/useStore";

function LatestRelease() {
  const { setScreen } = useStore(state => state);
  const [latestRelease, setLatestRelease] = useState(null);

  useEffect(() => {
    const getLatestRelease = async () => {
      const response = await fetch("https://api.github.com/repos/aaron5670/toggle-experiments-extension/releases/latest");
      const data = await response.json();
      const markdownContent = data.body.replace(/\r\n/g, "\n");

      setLatestRelease(markdownContent);
    };
    getLatestRelease();
  }, []);

  return (
    <Card p="lg" radius="md">
      {latestRelease ? (
        <ReactMarkdown>
          {latestRelease}
        </ReactMarkdown>
      ) : (
        <Flex
            mih={250}
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Loader size="lg" />
        </Flex>
      )}

      <Text fz="xs" mt="md" align="end">
        <Anchor onClick={() => setScreen("home")}>
          Go back to home
        </Anchor>
      </Text>
    </Card>
  );
}

export default LatestRelease;
