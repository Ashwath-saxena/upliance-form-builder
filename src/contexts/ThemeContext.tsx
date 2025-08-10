/* eslint-disable react-refresh/only-export-components */
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { createAppTheme } from "../app/theme";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  resolvedMode: "light" | "dark";
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = "upliance-theme-mode";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as ThemeMode) || "system";
    } catch {
      return "system";
    }
  });

  const resolvedMode: "light" | "dark" =
    mode === "system" ? (prefersDarkMode ? "dark" : "light") : mode;

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.warn("Failed to save theme preference:", error);
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((current) => {
      switch (current) {
        case "light":
          return "dark";
        case "dark":
          return "system";
        case "system":
          return "light";
        default:
          return "light";
      }
    });
  };

  const theme = createAppTheme(resolvedMode);

  const contextValue: ThemeContextType = {
    mode,
    resolvedMode,
    toggleMode,
    setMode,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return context;
}
