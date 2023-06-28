import { useEffect, useState } from "react";
import {
  Anchor,
  Avatar,
  Box,
  Collapse,
  createStyles,
  Divider,
  Group,
  Loader,
  Text,
  ThemeIcon
} from "@mantine/core";
import {
  IconExternalLink,
  IconToggleRight, IconCircleCheck, IconCircleX
} from "@tabler/icons-react";
import useStore from "~store/useStore";

const useStyles = createStyles((theme) => ({
  card: {
    cursor: "pointer",
    ":hover": {
      transition: "background-color 150ms ease",
      backgroundColor: "#f0f0f0"
    }
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

interface FeatureItemProps {
  feature: {
    project_id: string;
    status: string;
    id: string;
    name: string;
    description: string;
  };
}

const FeatureItem = ({ feature }: FeatureItemProps) => {
  const { classes } = useStyles();
  const { optimizelyAccessToken } = useStore(state => state);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [featureData, setFeatureData] = useState(null);

  useEffect(() => {
    const fetchFeature = async () => {
      if (opened) {
        try {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/features/${feature.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            }
          });
          const data = await response.json();
          setFeatureData(data);
        } catch (error) {
          console.error(error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchFeature();
  }, [opened]);

  return (
    <>
      <Group className={classes.card} py="sm" onClick={() => setOpened(true)} noWrap>
        <Avatar size={40} color="green">{<IconToggleRight size={20} stroke={1.5} />}</Avatar>
        <Text size="sm" weight={500} className={classes.name}>
          {feature.name}
        </Text>
      </Group>
      <Collapse in={opened}>
        {loading ? (<Group position="center" my="md"><Loader /></Group>) : (
          <Box mb="md">
            <Group position="apart" my="xs">
              <Group position="left">
                <Text size="xs" color="dimmed">
                  {feature?.description}
                </Text>
              </Group>
              <Text size="xs">
                <Anchor
                  href={`https://app.optimizely.com/v2/projects/${feature.project_id}/features/${feature.id}`}
                  target="_blank">
                  <IconExternalLink size={18} stroke={1.5} style={{ marginBottom: -4 }} /> Optimizely
                </Anchor>
              </Text>
            </Group>
            <Divider my="md" />
            <Text weight={500} mb="xs">Environments</Text>
            {Object.keys(featureData?.environments || {}).map((environment) => {
              const isEnabled = featureData?.environments[environment].rollout_rules[0].percentage_included > 0 && featureData?.environments[environment].rollout_rules[0].enabled;
              return (
                <Group position="apart">
                  <Group>
                    <ThemeIcon color={isEnabled ? 'teal' : 'red'} size={18} radius="xl">
                      {isEnabled ? <IconCircleCheck size="1rem" /> : <IconCircleX size="1rem" />}
                    </ThemeIcon>
                    <Text size="sm">{environment}</Text>
                  </Group>
                  <Text size="sm">{featureData?.environments[environment].rollout_rules[0].percentage_included / 100}%</Text>
                </Group>
              )
            })}
          </Box>
        )}
        {error && (
          <Text size="sm" mt="md" c="red" ta="center">
            {error}
          </Text>
        )}
      </Collapse>
    </>
  );
};

export default FeatureItem;
