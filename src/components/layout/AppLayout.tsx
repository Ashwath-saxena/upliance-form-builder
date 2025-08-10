// src/components/layout/AppLayout.tsx
import type { PropsWithChildren } from "react";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Container,
  Stack,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FolderIcon from "@mui/icons-material/Folder";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../common/ThemeToggle";
import { useThemeMode } from "../../contexts/ThemeContext";

const navItems = [
  { label: "Builder", path: "/create", icon: <CodeIcon /> },
  { label: "Preview", path: "/preview", icon: <VisibilityIcon /> },
  { label: "My Forms", path: "/myforms", icon: <FolderIcon /> },
];

export function AppLayout({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { resolvedMode } = useThemeMode();

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ alignItems: "center", gap: 2, px: 3 }}>
          <IconButton
            color="inherit"
            edge="start"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color:
                resolvedMode === "dark"
                  ? "rgba(248, 250, 252, 0.9)"
                  : "#212121",
            }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ flexGrow: 1 }}
          >
            <Avatar
              sx={{
                background:
                  resolvedMode === "dark"
                    ? "linear-gradient(135deg, #00b4d8 0%, #14a085 100%)"
                    : "linear-gradient(135deg, #1976d2 0%, #388e3c 100%)",
                width: 40,
                height: 40,
              }}
            >
              <CodeIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0 }}>
                Upliance
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", lineHeight: 1 }}
              >
                Form Builder
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <ThemeToggle />
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            {navItems.map((item) => {
              const isSelected = pathname === item.path;
              return (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => go(item.path)}
                  variant={isSelected ? "contained" : "text"}
                  sx={{
                    position: "relative",
                    color: isSelected
                      ? "#ffffff"
                      : resolvedMode === "dark"
                      ? "rgba(248, 250, 252, 0.9)"
                      : "#212121",
                    backgroundColor: isSelected
                      ? resolvedMode === "dark"
                        ? "#00b4d8"
                        : "#1976d2"
                      : "transparent",
                    border:
                      resolvedMode === "light" && !isSelected
                        ? "1px solid rgba(33, 33, 33, 0.1)"
                        : "none",
                    "&:hover": {
                      backgroundColor: isSelected
                        ? resolvedMode === "dark"
                          ? "#48cae4"
                          : "#42a5f5"
                        : resolvedMode === "dark"
                        ? "rgba(0, 180, 216, 0.08)"
                        : "rgba(25, 118, 210, 0.08)",
                      color: isSelected
                        ? "#ffffff"
                        : resolvedMode === "dark"
                        ? "#f8fafc"
                        : "#1976d2",
                    },
                    transition: "all 0.3s ease",
                    fontWeight: isSelected ? 600 : 500,
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box
          sx={{
            width: 280,
            background:
              resolvedMode === "dark"
                ? "linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%)"
                : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            height: "100%",
          }}
          role="presentation"
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  background:
                    resolvedMode === "dark"
                      ? "linear-gradient(135deg, #00b4d8 0%, #14a085 100%)"
                      : "linear-gradient(135deg, #1976d2 0%, #388e3c 100%)",
                  width: 40,
                  height: 40,
                }}
              >
                <CodeIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Upliance
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Form Builder
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color:
                  resolvedMode === "dark"
                    ? "rgba(248, 250, 252, 0.9)"
                    : "#212121",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    resolvedMode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.08)",
                  transform: "scale(1.1)",
                },
              }}
              aria-label="Close navigation drawer"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ px: 2, py: 1 }}>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => go(item.path)}
                selected={pathname === item.path}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  color:
                    pathname === item.path
                      ? resolvedMode === "dark"
                        ? "#00b4d8"
                        : "#1976d2"
                      : "text.primary",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      resolvedMode === "dark"
                        ? "rgba(0, 180, 216, 0.1)"
                        : "rgba(25, 118, 210, 0.08)",
                    transform: "translateX(8px)",
                  },
                  "&.Mui-selected": {
                    backgroundColor:
                      resolvedMode === "dark"
                        ? "rgba(0, 180, 216, 0.2)"
                        : "rgba(25, 118, 210, 0.15)",
                    "&:hover": {
                      backgroundColor:
                        resolvedMode === "dark"
                          ? "rgba(0, 180, 216, 0.3)"
                          : "rgba(25, 118, 210, 0.2)",
                    },
                  },
                }}
              >
                <Box sx={{ mr: 2, color: "inherit" }}>{item.icon}</Box>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ p: 2, mt: "auto" }}>
            <ThemeToggle showLabel />
          </Box>
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        {children}
      </Container>
    </Box>
  );
}
