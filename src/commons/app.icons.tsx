import { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowUp,
  Bookmark,
  Cake,
  Calendar,
  CalendarOff,
  Heartbeat,
  InfoCircle,
  LayoutGrid,
  Menu2,
  Pencil,
  Plus,
  Settings,
  Trash
} from "tabler-icons-react";
import { MantineColor, ThemeIcon } from "@mantine/core";
import { birthday, born, newyear } from "./app.colors";
import { AppIcon } from "../types";

const iconStyle: CSSProperties = { padding: 3 };

export const icons: Record<AppIcon, ReactNode> = {
  "plus": <Plus style={iconStyle}/>,
  "pencil": <Pencil style={iconStyle}/>,
  "trash": <Trash style={iconStyle}/>,
  "arrowUp": <ArrowUp style={iconStyle}/>,
  "menu": <Menu2 style={iconStyle}/>,

  "birthday": <Cake size={16} color={birthday.fg}/>,
  "newyear": <Calendar size={16} color={newyear.fg}/>,
  "calendarOff": <CalendarOff size={16}/>,
  "born": <Heartbeat size={16} color={born.fg}/>,

  "headerGrid": <LayoutGrid size={16}/>,
  "headerSettings": <Settings size={16}/>,

  "alertInfo": <InfoCircle size={18}/>,
  "alertWarning": <AlertTriangle size={18}/>,

  "bookmark": <Bookmark size={24} style={{ padding: 4, fill: "black" }}/>
};

export const ColorIcon = (color: MantineColor, icon: AppIcon) =>
  <ThemeIcon variant="light" color={color}>{icons[icon]}</ThemeIcon>;
