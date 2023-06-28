import { useMantineTheme, ActionIcon, TextInput, Divider, Loader, Center, Anchor, Text, Card } from "@mantine/core";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import FeatureItem from "~components/FeatureItem";
import Header from "~components/Header";
import useStore from "~store/useStore";

function SearchFeatures() {
  const theme = useMantineTheme();
  const { optimizelyAccessToken, optimizelyProjectId, setScreen } = useStore(state => state);
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);
  const [loading, setLoading] = useState(false);
  const [features, setFeatures] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      try {
        if (debounced.length > 0) {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/search?project_id=${optimizelyProjectId}&per_page=100&page=1&query=${value}&type=feature`, {
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            },
            method: "GET"
          });
          if (response.ok) {
            const data = await response.json();
            setFeatures(data);
          } else {
            setError("Error searching for features");
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
      <Header title="Search Features" />
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
            placeholder="Search features"
            rightSectionWidth={37}
            value={value}
            radius="xl"
            size="sm"
            autoFocus
          />
          {!features && (
            <>
              <Divider labelPosition="center" label="OR" mt="md" />
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
      {features?.length > 0 && (
        <>
          <Text size={15} mt="md">
            {features.length} features found
          </Text>
          {features.map((feature) => (
            <FeatureItem feature={feature} key={feature.id} />
          ))}
        </>
      )}
      {features?.length === 0 && (
        <Text size="sm" mt="md">
          No features found
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

export default SearchFeatures;
