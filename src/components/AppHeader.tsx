import { Link } from "react-router-dom";
import { ActionIcon, ColorScheme, Group, Header, Text, UnstyledButton } from "@mantine/core";
import { MoonStars, Settings, Sun } from "tabler-icons-react";

interface AppHeaderProps {
  colorScheme: ColorScheme,
  colorSchemeToggleFn: (value?: ColorScheme) => void
}

const AppHeader = (props: AppHeaderProps) => {
  const { colorScheme, colorSchemeToggleFn } = props;
  return <Header height={60}>
    <Group sx={{ height: "100%" }} px={20} position="apart">
      <Group>
        <UnstyledButton component={Link} to="/home">
          <Group>
            <Text size="xl" weight={700}>Life Calendar</Text>
          </Group>
        </UnstyledButton>
      </Group>
      <Group>
        <ActionIcon variant="default" component={Link} to="/config" size={30}>
          <Settings size={16}/>
        </ActionIcon>
        <ActionIcon variant="default" onClick={() => colorSchemeToggleFn()} size={30}>
          {colorScheme === "dark" ? <Sun size={16}/> : <MoonStars size={16}/>}
        </ActionIcon>
      </Group>
    </Group>
  </Header>;
};

export default AppHeader;
