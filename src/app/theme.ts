// src/app/theme.ts
import { createTheme } from "@mui/material/styles";

export const createAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#00b4d8" : "#2563eb",
        light: mode === "dark" ? "#48cae4" : "#3b82f6",
        dark: mode === "dark" ? "#0077b6" : "#1e40af",
        contrastText: "#ffffff",
      },
      secondary: {
        main: mode === "dark" ? "#14a085" : "#10b981",
        light: mode === "dark" ? "#4ecdc4" : "#34d399",
        dark: mode === "dark" ? "#0f6b5c" : "#047857",
        contrastText: "#ffffff",
      },
      background: {
        default: mode === "dark" ? "#0a0e1a" : "#f8fafc",
        paper: mode === "dark" ? "#121829" : "#ffffff",
      },
      surface: {
        main: mode === "dark" ? "#1a2332" : "#f1f5f9",
        light: mode === "dark" ? "#252f40" : "#e2e8f0",
        dark: mode === "dark" ? "#0f1622" : "#cbd5e1",
      },
      text: {
        primary: mode === "dark" ? "#f8fafc" : "#1e293b",
        secondary: mode === "dark" ? "rgba(248, 250, 252, 0.7)" : "#64748b",
      },
      accent: {
        neon: mode === "dark" ? "#00ffff" : "#06b6d4",
        purple: mode === "dark" ? "#8b5cf6" : "#7c3aed",
        pink: mode === "dark" ? "#f472b6" : "#ec4899",
      },
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#047857",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
      },
      warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
      },
      info: {
        main: "#06b6d4",
        light: "#22d3ee",
        dark: "#0891b2",
      },
      divider:
        mode === "dark"
          ? "rgba(248, 250, 252, 0.12)"
          : "rgba(30, 41, 59, 0.12)",
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: [
        "Inter",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
      ].join(","),
      h4: {
        fontWeight: 700,
        fontSize: "2rem",
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #00b4d8 0%, #14a085 100%)"
            : "linear-gradient(135deg, #2563eb 0%, #10b981 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      },
      h5: {
        fontWeight: 600,
        color: mode === "dark" ? "#f8fafc" : "#1e293b",
      },
      h6: {
        fontWeight: 600,
        color: mode === "dark" ? "#f8fafc" : "#1e293b",
      },
      subtitle1: {
        fontWeight: 600,
        color: mode === "dark" ? "#f8fafc" : "#1e293b",
      },
      subtitle2: {
        fontWeight: 500,
        color:
          mode === "dark"
            ? "rgba(248, 250, 252, 0.8)"
            : "rgba(30, 41, 59, 0.8)",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background:
              mode === "dark"
                ? "linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            minHeight: "100vh",
            transition: "background 0.3s ease",
          },
          "*::-webkit-scrollbar": {
            width: "8px",
          },
          "*::-webkit-scrollbar-track": {
            background: mode === "dark" ? "#1a2332" : "#f1f5f9",
          },
          "*::-webkit-scrollbar-thumb": {
            background: mode === "dark" ? "#00b4d8" : "#2563eb",
            borderRadius: "4px",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background:
              mode === "dark"
                ? "rgba(18, 24, 41, 0.95)"
                : "rgba(248, 250, 252, 0.95)",
            backdropFilter: "blur(20px)",
            borderBottom:
              mode === "dark"
                ? "1px solid rgba(0, 180, 216, 0.1)"
                : "1px solid rgba(37, 99, 235, 0.1)",
            boxShadow:
              mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.25)"
                : "0 4px 20px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          variant: "contained",
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 10,
            padding: "10px 24px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              opacity: 0,
              transition: "opacity 0.3s ease",
            },
            "&:hover:before": {
              opacity: 1,
            },
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow:
                mode === "dark"
                  ? "0 8px 25px rgba(0, 180, 216, 0.3)"
                  : "0 8px 25px rgba(37, 99, 235, 0.3)",
            },
          },
          containedPrimary: {
            background:
              mode === "dark"
                ? "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)"
                : "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            "&:hover": {
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, #48cae4 0%, #00b4d8 100%)"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            },
          },
          containedSecondary: {
            background:
              mode === "dark"
                ? "linear-gradient(135deg, #14a085 0%, #0f6b5c 100%)"
                : "linear-gradient(135deg, #10b981 0%, #047857 100%)",
            "&:hover": {
              background:
                mode === "dark"
                  ? "linear-gradient(135deg, #4ecdc4 0%, #14a085 100%)"
                  : "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
            },
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 10,
              backgroundColor:
                mode === "dark"
                  ? "rgba(248, 250, 252, 0.05)"
                  : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              "& fieldset": {
                borderColor:
                  mode === "dark"
                    ? "rgba(0, 180, 216, 0.3)"
                    : "rgba(37, 99, 235, 0.3)",
              },
              "&:hover fieldset": {
                borderColor:
                  mode === "dark"
                    ? "rgba(0, 180, 216, 0.6)"
                    : "rgba(37, 99, 235, 0.6)",
              },
              "&.Mui-focused fieldset": {
                borderColor: mode === "dark" ? "#00b4d8" : "#2563eb",
                boxShadow:
                  mode === "dark"
                    ? "0 0 0 3px rgba(0, 180, 216, 0.1)"
                    : "0 0 0 3px rgba(37, 99, 235, 0.1)",
              },
            },
            "& .MuiInputLabel-root": {
              color:
                mode === "dark"
                  ? "rgba(248, 250, 252, 0.7)"
                  : "rgba(30, 41, 59, 0.7)",
              "&.Mui-focused": {
                color: mode === "dark" ? "#00b4d8" : "#2563eb",
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark"
                ? "rgba(18, 24, 41, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: 16,
            border:
              mode === "dark"
                ? "1px solid rgba(0, 180, 216, 0.1)"
                : "1px solid rgba(37, 99, 235, 0.1)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow:
                mode === "dark"
                  ? "0 8px 32px rgba(0, 180, 216, 0.15)"
                  : "0 8px 32px rgba(37, 99, 235, 0.15)",
              borderColor:
                mode === "dark"
                  ? "rgba(0, 180, 216, 0.2)"
                  : "rgba(37, 99, 235, 0.2)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === "dark"
                ? "rgba(18, 24, 41, 0.8)"
                : "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: 16,
            border:
              mode === "dark"
                ? "1px solid rgba(0, 180, 216, 0.1)"
                : "1px solid rgba(37, 99, 235, 0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                mode === "dark"
                  ? "0 12px 40px rgba(0, 180, 216, 0.2)"
                  : "0 12px 40px rgba(37, 99, 235, 0.2)",
              borderColor:
                mode === "dark"
                  ? "rgba(0, 180, 216, 0.3)"
                  : "rgba(37, 99, 235, 0.3)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            backdropFilter: "blur(10px)",
          },
          colorPrimary: {
            backgroundColor:
              mode === "dark"
                ? "rgba(0, 180, 216, 0.2)"
                : "rgba(37, 99, 235, 0.2)",
            color: mode === "dark" ? "#48cae4" : "#2563eb",
            border:
              mode === "dark"
                ? "1px solid rgba(0, 180, 216, 0.3)"
                : "1px solid rgba(37, 99, 235, 0.3)",
          },
          colorSecondary: {
            backgroundColor:
              mode === "dark"
                ? "rgba(20, 160, 133, 0.2)"
                : "rgba(16, 185, 129, 0.2)",
            color: mode === "dark" ? "#4ecdc4" : "#10b981",
            border:
              mode === "dark"
                ? "1px solid rgba(20, 160, 133, 0.3)"
                : "1px solid rgba(16, 185, 129, 0.3)",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backdropFilter: "blur(20px)",
          },
          filledSuccess: {
            background:
              "linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(4, 120, 87, 0.9) 100%)",
          },
          filledError: {
            background:
              "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)",
          },
          filledWarning: {
            background:
              "linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%)",
          },
          filledInfo: {
            background:
              "linear-gradient(135deg, rgba(6, 182, 212, 0.9) 0%, rgba(8, 145, 178, 0.9) 100%)",
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            backgroundColor:
              mode === "dark"
                ? "rgba(0, 180, 216, 0.1)"
                : "rgba(37, 99, 235, 0.1)",
          },
          bar: {
            background:
              mode === "dark"
                ? "linear-gradient(135deg, #00b4d8 0%, #14a085 100%)"
                : "linear-gradient(135deg, #2563eb 0%, #10b981 100%)",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(0, 180, 216, 0.1)"
                  : "rgba(37, 99, 235, 0.1)",
              transform: "scale(1.05)",
            },
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 0",
            "&:hover": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(0, 180, 216, 0.1)"
                  : "rgba(37, 99, 235, 0.1)",
            },
            "&.Mui-selected": {
              backgroundColor:
                mode === "dark"
                  ? "rgba(0, 180, 216, 0.2)"
                  : "rgba(37, 99, 235, 0.2)",
              borderLeft:
                mode === "dark" ? "3px solid #00b4d8" : "3px solid #2563eb",
            },
          },
        },
      },
    },
  });

declare module "@mui/material/styles" {
  interface Palette {
    surface: {
      main: string;
      light: string;
      dark: string;
    };
    accent: {
      neon: string;
      purple: string;
      pink: string;
    };
  }

  interface PaletteOptions {
    surface?: {
      main: string;
      light: string;
      dark: string;
    };
    accent?: {
      neon: string;
      purple: string;
      pink: string;
    };
  }
}
