// src/components/common/ThemeToggle.tsx
import { IconButton, Tooltip, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import { useThemeMode } from "../../contexts/ThemeContext";

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: 12,
  padding: 12,
  background:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(25, 118, 210, 0.08)",
  backdropFilter: "blur(10px)",
  border:
    theme.palette.mode === "dark"
      ? "1px solid rgba(255, 255, 255, 0.1)"
      : "1px solid rgba(25, 118, 210, 0.2)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  color:
    theme.palette.mode === "dark"
      ? theme.palette.text.primary
      : theme.palette.primary.main,

  "&:hover": {
    transform: "scale(1.05)",
    background:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(25, 118, 210, 0.12)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 8px 25px rgba(0, 0, 0, 0.15)"
        : "0 8px 25px rgba(25, 118, 210, 0.25)",
    borderColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(25, 118, 210, 0.3)",
  },

  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
        : "linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0.05) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },

  "&:hover:before": {
    opacity: 1,
  },
}));

const IconContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",

  "& svg": {
    fontSize: 20,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
}));

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { mode, resolvedMode, toggleMode } = useThemeMode();

  const getIcon = () => {
    switch (mode) {
      case "light":
        return <LightModeIcon />;
      case "dark":
        return <DarkModeIcon />;
      case "system":
        return <SettingsBrightnessIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getLabel = () => {
    switch (mode) {
      case "light":
        return "Switch to Dark Mode";
      case "dark":
        return "Switch to System Mode";
      case "system":
        return "Switch to Light Mode";
      default:
        return "Switch Theme";
    }
  };

  const getModeText = () => {
    switch (mode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return `System (${resolvedMode})`;
      default:
        return "Light";
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title={getLabel()} arrow>
        <AnimatedIconButton
          onClick={toggleMode}
          color="inherit"
          aria-label={getLabel()}
        >
          <IconContainer>{getIcon()}</IconContainer>
        </AnimatedIconButton>
      </Tooltip>

      {showLabel && (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          {getModeText()}
        </Typography>
      )}
    </Box>
  );
}
