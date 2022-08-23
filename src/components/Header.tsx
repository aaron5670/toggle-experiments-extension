import { ActionIcon, Grid, Text } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons";
import useStore from "~store/useStore";

interface HeaderProps {
  title: string;
  description?: string;
}

const Header = ({title, description = ""}: HeaderProps) => {
  const {screen, setScreen} = useStore(state => state);

  const changeScreen = () => {
    if (screen === 'settings') {
      setScreen('home');
    } else {
      setScreen('settings');
    }
  }

  return (
    <Grid>
      <Grid.Col span={10}>
        <Text size="lg" weight={500}>
          {title}
        </Text>
        <Text size="xs" color="dimmed" mt={3} mb="xl">
          {description}
        </Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <ActionIcon onClick={changeScreen}>
          <IconAdjustments />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  )
}

export default Header;
