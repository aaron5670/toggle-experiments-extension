import { useEffect, useState } from "react";
import { TextInput, ActionIcon, useMantineTheme, Card, Text, Loader, Divider, Anchor, Center } from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import useStore from "~store/useStore";
import Header from "~components/Header";
import SearchItem from "~components/SearchItem";

function SearchFeatures() {
  const theme = useMantineTheme();
  const { optimizelyAccessToken, optimizelyProjectId, setScreen } = useStore(state => state);
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);
  const [loading, setLoading] = useState(false);
  const [experiments, setExperiments] = useState(null);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const search = async () => {
      try {
        if (debounced.length > 0) {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/search?project_id=${optimizelyProjectId}&per_page=100&page=1&query=${value}&type=experiment`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            }
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
    <Card p="lg" radius="md">
      <Header title="Search Features" />
      {optimizelyAccessToken && optimizelyProjectId ? (
        <>
          <TextInput
            value={value}
            onChange={(event) => setValue(event.target.value)}
            icon={<IconSearch size={18} stroke={1.5} />}
            radius="xl"
            size="sm"
            autoFocus
            rightSection={
              loading ? (
                <Loader size="xs" />
              ) : (
                <ActionIcon size={28} radius="xl" color={theme.primaryColor} variant="filled">
                  <IconArrowRight size={16} stroke={1.5} />
                </ActionIcon>
              )
            }
            placeholder="Search features"
            rightSectionWidth={37}
          />
          {!experiments && (
            <>
              <Divider mt="md" label="OR" labelPosition="center" />
              <Center>
                <Anchor onClick={() => setScreen("search-experiments")} size="xs" mt="xs">
                  Search for experiments
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
            <SearchItem key={experiment.id} experiment={experiment} />
          ))}
        </>
      )}
      {experiments?.length === 0 && (
        <Text size="sm" mt="md">
          No experiments found
        </Text>
      )}
      {error && (
        <Text size="sm" mt="md" c="red" ta="center">
          {error}
        </Text>
      )}
    </Card>
  );
}

export default SearchFeatures;
