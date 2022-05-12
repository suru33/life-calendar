import { CSSProperties, ReactNode } from "react";
import { Pencil, Plus, Trash } from "tabler-icons-react";
import { MantineColor, ThemeIcon } from "@mantine/core";

const iconStyle: CSSProperties = { padding: 3 };

export const icons: Record<string, ReactNode> = {
  "plus": <Plus style={iconStyle}/>,
  "pencil": <Pencil style={iconStyle}/>,
  "trash": <Trash style={iconStyle}/>
};

export const AppIcon = (color: MantineColor, icon: ReactNode) =>
  <ThemeIcon variant="light" color={color}>{icon}</ThemeIcon>;
