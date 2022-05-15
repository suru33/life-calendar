import { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Bookmark,
  Cake,
  Calendar,
  CalendarOff,
  Heartbeat,
  InfoCircle,
  MoodConfuzed,
  Pencil,
  Plus,
  Settings,
  Trash
} from "tabler-icons-react";
import { MantineColor, ThemeIcon } from "@mantine/core";
import { birthDayForeground, newYearForeground } from "./app.colors";

const iconStyle: CSSProperties = { padding: 3 };

export const icons: Record<string, ReactNode> = {
  "plus": <Plus style={iconStyle}/>,
  "pencil": <Pencil style={iconStyle}/>,
  "trash": <Trash style={iconStyle}/>,

  "birthday": <Cake size={16} color={birthDayForeground}/>,
  "newYear": <Calendar size={16} color={newYearForeground}/>,
  "calendarOff": <CalendarOff size={16}/>,
  "born": <Heartbeat size={16} color={birthDayForeground}/>,

  "headerSettings": <Settings size={16}/>,

  "notificationSad": <MoodConfuzed size={18}/>,
  "alertInfo": <InfoCircle size={18}/>,
  "alertWarning": <AlertTriangle size={18}/>,

  "bookmark": <Bookmark size={24} style={{ padding: 4, fill: "black" }}/>
};

export const AppIcon = (color: MantineColor, icon: ReactNode) =>
  <ThemeIcon variant="light" color={color}>{icon}</ThemeIcon>;
