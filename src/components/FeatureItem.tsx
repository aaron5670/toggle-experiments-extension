import {
  createStyles,
  ThemeIcon,
  Collapse,
  Divider,
  Loader,
  Avatar,
  Anchor,
  Group,
  Text,
  Box
} from "@mantine/core";
import {
  IconExternalLink,
  IconToggleRight, IconCircleCheck, IconCircleX
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import useStore from "~store/useStore";

const useStyles = createStyles((theme) => ({
  card: {
    ":hover": {
      backgroundColor: "#f0f0f0",
      transition: "background-color 150ms ease"
    },
    cursor: "pointer"
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`
  }
}));

interface FeatureItemProps {
  feature: {
    description: string;
    project_id: string;
    status: string;
    name: string;
    id: string;
  };
}

const FeatureItem = ({ feature }: FeatureItemProps) => {
  const { classes } = useStyles();
  const { optimizelyAccessToken } = useStore(state => state);
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [featureData, setFeatureData] = useState(null);

  useEffect(() => {
    const fetchFeature = async () => {
      if (opened) {
        try {
          setLoading(true);
          const response = await fetch(`https://api.optimizely.com/v2/features/${feature.id}`, {
            headers: {
              Authorization: `Bearer ${optimizelyAccessToken}`
            },
            method: "GET"
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
      <Group onClick={() => setOpened(true)} className={classes.card} py="sm" noWrap>
        <Avatar color="green" size={40}>{<IconToggleRight stroke={1.5} size={20} />}</Avatar>
        <Text className={classes.name} weight={500} size="sm">
          {feature.name}
        </Text>
      </Group>
      <Collapse in={opened}>
        {loading ? (<Group position="center" my="md"><Loader /></Group>) : (
          <Box mb="md">
            <Group position="apart" my="xs">
              <Group position="left">
                <Text color="dimmed" size="xs">
                  {feature?.description}
                </Text>
              </Group>
              <Text size="xs">
                <Anchor
                  href={`https://app.optimizely.com/v2/projects/${feature.project_id}/features/${feature.id}`}
                  target="_blank">
                  <IconExternalLink style={{ marginBottom: -4 }} stroke={1.5} size={18} /> Optimizely
                </Anchor>
              </Text>
            </Group>
            <Divider my="md" />
            <Text weight={500} mb="xs">Environments</Text>
            {Object.keys(featureData?.environments || {}).map((environment, index) => {
              const isEnabled = featureData?.environments[environment].rollout_rules[0].percentage_included > 0 && featureData?.environments[environment].rollout_rules[0].enabled;
              return (
                <Group position="apart" key={index}>
                  <Group>
                    <ThemeIcon color={isEnabled ? 'teal' : 'red'} radius="xl" size={18}>
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
          <Text ta="center" size="sm" mt="md" c="red">
            {error}
          </Text>
        )}
      </Collapse>
    </>
  );
};

export default FeatureItem;
