import { Link } from "react-router-dom";
import { ActionIcon, Group, Header, Menu, Text, UnstyledButton } from "@mantine/core";
import { icons } from "../commons/app.icons";

const AppHeader = () =>
  <Header height={60}>
    <Group sx={{ height: "100%" }} px={20} position="apart">
      <Group>
        <UnstyledButton component={Link} to="/home">
          <Text size="xl" weight={700}>Life Calendar</Text>
        </UnstyledButton>
      </Group>
      <Group>
        <ActionIcon variant="default" component={Link} to="/home" size={30}>
          {icons.headerHome}
        </ActionIcon>
        <Menu
          withArrow
          shadow="xl"
          size="sm"
          delay={500}
          control={<ActionIcon variant="default">{icons.headerSave}</ActionIcon>}>
          <Menu.Label>Import and export all the data</Menu.Label>
          <Menu.Item icon={icons.menuFileImport}>Import</Menu.Item>
          <Menu.Item icon={icons.menuFileImport}>Export</Menu.Item>
        </Menu>
        <ActionIcon variant="default" component={Link} to="/config" size={30}>
          {icons.headerSettings}
        </ActionIcon>
      </Group>
    </Group>
  </Header>;
export default AppHeader;
