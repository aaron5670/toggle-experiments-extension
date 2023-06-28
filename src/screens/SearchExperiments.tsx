import { useMantineTheme, ActionIcon, TextInput, Divider, Loader, Center, Anchor, Text, Card } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import ExperimentItem from "~components/ExperimentItem";
import React, { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import Header from "~components/Header";
import useStore from "~store/useStore";

function SearchExperiments() {
  const theme = useMantineTheme();
  const { optimizelyAccessToken, optimizelyProjectId, setScreen } = useStore(state => state);
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);
  const [loading, setLoading] = useState(false);
  const [experiments, setExperiments] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      try {
        if (debounced.length > 0) {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/search?project_id=${optimizelyProjectId}&per_page=100&page=1&query=${value}&type=experiment`, {
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            },
            method: "GET"
          });
          if (response.ok) {
            const data = await response.json();
            setExperiments(data);
          } else {
            setError("Error searching for experiments");
          }
        }
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [debounced]);

  return (
    <Card radius="md" p="lg">
      <Header title="Search Experiment" />
      {optimizelyAccessToken && optimizelyProjectId ? (
        <>
          <TextInput
            rightSection={
              loading ? (
                <Loader size="xs" />
              ) : (
                <ActionIcon color={theme.primaryColor} variant="filled" radius="xl" size={28}>
                  <IconArrowRight stroke={1.5} size={16} />
                </ActionIcon>
              )
            }
            onChange={(event) => setValue(event.target.value)}
            icon={<IconSearch stroke={1.5} size={18} />}
            placeholder="Search experiments"
            rightSectionWidth={37}
            value={value}
            radius="xl"
            size="sm"
            autoFocus
          />
          {!experiments && (
            <>
              <Divider labelPosition="center" label="OR" mt="md" />
              <Center>
                <Anchor onClick={() => setScreen("search-features")} size="xs" mt="xs">
                  Search for feature toggles
                </Anchor>
              </Center>
            </>
          )}
        </>
        ) : (
        <Text fz="sm">
          Optimizely access token not found. Please go to the <a onClick={() => setScreen("settings")}>settings screen</a> to set it.
        </Text>
      )}
      {experiments?.length > 0 && (
        <>
          <Text size={15} mt="md">
            {experiments.length} experiments found
          </Text>
          {experiments.map((experiment) => (
            <ExperimentItem experiment={experiment} key={experiment.id} />
          ))}
        </>
      )}
      {experiments?.length === 0 && (
        <Text size="sm" mt="md">
          No experiments found
        </Text>
      )}
      {error && (
        <Text ta="center" size="sm" mt="md" c="red">
          {error}
        </Text>
      )}
    </Card>
  );
}

export default SearchExperiments;
