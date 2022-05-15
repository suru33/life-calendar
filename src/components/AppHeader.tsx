import { Link } from "react-router-dom";
import { ActionIcon, Group, Header, Text, UnstyledButton } from "@mantine/core";
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
        {/*   TODO: Add home icon */}
        <ActionIcon variant="default" component={Link} to="/config" size={30}>
          {icons.headerSettings}
        </ActionIcon>
      </Group>
    </Group>
  </Header>;
export default AppHeader;
