import { Link } from "react-router-dom";
import { ActionIcon, ColorScheme, Group, Header, Text, UnstyledButton } from "@mantine/core";
import { icons } from "../app-icons";

interface AppHeaderProps {
  colorScheme: ColorScheme,
  colorSchemeToggleFn: (value?: ColorScheme) => void
}

const AppHeader = (props: AppHeaderProps) => {
  const { colorScheme, colorSchemeToggleFn } = props;
  return (
    <Header height={60}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Group>
          <UnstyledButton component={Link} to="/home">
            <Text size="xl" weight={700}>Life Calendar</Text>
          </UnstyledButton>
        </Group>
        <Group>
          <ActionIcon variant="default" component={Link} to="/config" size={30}>
            {icons.headerSettings}
          </ActionIcon>
          <ActionIcon variant="default" onClick={() => colorSchemeToggleFn()} size={30}>
            {colorScheme === "dark" ? icons.headerSun : icons.headerMoon}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
};

export default AppHeader;
