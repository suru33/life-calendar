import { CSSProperties, ReactNode } from "react";
import { InfoCircle, MoodConfuzed, MoonStars, Pencil, Plus, Settings, Sun, Trash } from "tabler-icons-react";
import { MantineColor, ThemeIcon } from "@mantine/core";

const iconStyle: CSSProperties = { padding: 3 };

export const icons: Record<string, ReactNode> = {
  "plus": <Plus style={iconStyle}/>,
  "pencil": <Pencil style={iconStyle}/>,
  "trash": <Trash style={iconStyle}/>,
  "headerSettings": <Settings size={16}/>,
  "headerSun": <Sun size={16}/>,
  "headerMoon": <MoonStars size={16}/>,
  "notificationSad": <MoodConfuzed size={18} />,
  "alertInfo": <InfoCircle size={18} />
};

export const AppIcon = (color: MantineColor, icon: ReactNode) =>
  <ThemeIcon variant="light" color={color}>{icon}</ThemeIcon>;
