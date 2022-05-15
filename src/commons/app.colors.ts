import { DEFAULT_THEME } from "@mantine/core";
import { ColorCombo } from "../types";

export const swatches = [
  ...DEFAULT_THEME.colors.blue.slice(1, 9),
  ...DEFAULT_THEME.colors.cyan.slice(1, 9),
  ...DEFAULT_THEME.colors.grape.slice(1, 9),
  ...DEFAULT_THEME.colors.green.slice(1, 9),
  ...DEFAULT_THEME.colors.indigo.slice(1, 9),
  ...DEFAULT_THEME.colors.lime.slice(1, 9),
  ...DEFAULT_THEME.colors.orange.slice(1, 9),
  ...DEFAULT_THEME.colors.pink.slice(1, 9),
  ...DEFAULT_THEME.colors.red.slice(1, 9),
  ...DEFAULT_THEME.colors.teal.slice(1, 9),
  ...DEFAULT_THEME.colors.violet.slice(1, 9),
  ...DEFAULT_THEME.colors.yellow.slice(1, 9),
  ...DEFAULT_THEME.colors.gray.slice(1, 9)
];

export const born: ColorCombo = {
  bg: "#ff0000",
  fg: "#ffffff"
};

export const birthday: ColorCombo = {
  bg: "#6200ea",
  fg: "#ede7f6"
};

export const newyear: ColorCombo = {
  bg: "#334155",
  fg: "#f8fafc"
};

export const defaultBg = "#f8f8ff";

