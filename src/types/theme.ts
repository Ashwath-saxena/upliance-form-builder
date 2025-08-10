// src/types/theme.ts
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const THEME_STORAGE_KEY = "upliance-theme-mode";
