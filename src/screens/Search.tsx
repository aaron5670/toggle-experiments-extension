import { useEffect, useState } from "react";
import { Card, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import useStore from "~store/useStore";
import FloatingLabelInput from "~components/FloatingLabelInput";
import Header from "~components/Header";
import SearchItem from "~components/SearchItem";

function Search() {
  const { optimizelyAccessToken, setScreen } = useStore(state => state);
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
          const response = await fetch(`https://api.optimizely.com/v2/search?project_id=17209910795&per_page=100&page=1&query=${value}&type=experiment`, {
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
      <Header title="Search Experiment" />
      {optimizelyAccessToken ? (
        <FloatingLabelInput
          label="Experiment name"
          value={value}
          onChange={setValue}
          loading={loading}
        />) : (
        <span>
          Optimizely access token not found. Please go to the <a onClick={() => setScreen("settings")} href="#">settings screen</a> to set it.
        </span>
      )}
      {experiments?.length > 0 && (
        <>
          <Text size="sm" mt="md">
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

export default Search;
