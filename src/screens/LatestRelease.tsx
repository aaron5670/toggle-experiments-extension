import { Loader, Anchor, Text, Flex, Card } from "@mantine/core";
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
    <Card radius="md" p="lg">
      {latestRelease ? (
        <ReactMarkdown>
          {latestRelease}
        </ReactMarkdown>
      ) : (
        <Flex
            justify="center"
          direction="row"
          align="center"
          wrap="wrap"
          mih={250}
        >
          <Loader size="lg" />
        </Flex>
      )}

      <Text align="end" fz="xs" mt="md">
        <Anchor onClick={() => setScreen("home")}>
          Go back to home
        </Anchor>
      </Text>
    </Card>
  );
}

export default LatestRelease;
