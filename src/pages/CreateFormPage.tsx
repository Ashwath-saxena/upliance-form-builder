// src/pages/CreateFormPage.tsx
import { useMemo, useState } from "react";
import {
  Button,
  Paper,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { FieldList } from "../features/builder/components/FieldList";
import { FieldEditor } from "../features/builder/components/FieldEditor";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import {
  resetBuilder,
  setFormName,
  setLastSavedAt,
} from "../features/builder/builderSlice";
import { buildFormSchema, checkSchemaIssues } from "../utils/schema";
import {
  saveFormById,
  loadIndex,
  saveIndex,
  getStorageStats,
} from "../utils/storage";
import { addOrUpdateMeta } from "../features/library/librarySlice";
import { useThemeMode } from "../contexts/ThemeContext";

type SnackMessage = {
  open: boolean;
  msg: string;
  severity: "success" | "error" | "warning" | "info";
};

export function CreateFormPage() {
  const { resolvedMode } = useThemeMode();
  const fields = useSelector((s: RootState) => s.builder.fields);
  const formName = useSelector((s: RootState) => s.builder.formName) || "";
  const lastSavedAt = useSelector((s: RootState) => s.builder.lastSavedAt);
  const dispatch = useDispatch();

  const [snack, setSnack] = useState<SnackMessage>({
    open: false,
    msg: "",
    severity: "success",
  });
  const [saveOpen, setSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => fields.length > 0, [fields]);
  const storageStats = useMemo(() => getStorageStats(), []);

  const showSnack = (
    msg: string,
    severity: SnackMessage["severity"] = "success"
  ) => {
    setSnack({ open: true, msg, severity });
  };

  const handleSave = () => {
    if (!formName.trim()) {
      showSnack("Please enter a form name first", "warning");
      return;
    }
    setSaveOpen(true);
  };

  const doSave = async () => {
    setSaving(true);

    try {
      const name = formName.trim();
      const schema = buildFormSchema(name, fields);
      const issues = checkSchemaIssues(schema);

      if (!issues.ok) {
        showSnack(`Validation failed: ${issues.errors.join(" | ")}`, "error");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      saveFormById(schema);
      const index = loadIndex();
      const meta = {
        id: schema.id,
        name: schema.name,
        createdAt: schema.createdAt,
      };
      saveIndex([meta, ...index.filter((m) => m.id !== schema.id)]);

      dispatch(addOrUpdateMeta(meta));
      dispatch(setLastSavedAt(schema.createdAt));

      showSnack(`✨ Form "${name}" saved successfully!`, "success");
    } catch (error) {
      showSnack("❌ Failed to save form. Please try again.", "error");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
      setSaveOpen(false);
    }
  };

  const doReset = () => {
    dispatch(resetBuilder());
    showSnack("🔄 Builder reset successfully", "info");
  };

  return (
    <Stack spacing={4}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #ffffffff 0%, #1474a0ff 50%, #00ff3ca2 100%)",
            backgroundSize: "200% 200%",
            animation: "gradient 5s ease infinite",
            "@keyframes gradient": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <AutoAwesomeIcon
            sx={{ mr: 2, fontSize: 40, verticalAlign: "middle" }}
          />
          Form Builder Studio
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", maxWidth: 600, mx: "auto" }}
        >
          Create dynamic, intelligent forms with validations, derived fields,
          and real-time preview
        </Typography>
      </Box>

      {/* Stats Dashboard */}
      <Card
        sx={{
          background:
            "linear-gradient(135deg, rgba(0, 180, 216, 0.1) 0%, rgba(20, 160, 133, 0.1) 100%)",
        }}
      >
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)",
                  }}
                >
                  <DataObjectIcon sx={{ color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {fields.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Fields
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #14a085 0%, #0f6b5c 100%)",
                  }}
                >
                  <SaveIcon sx={{ color: "white" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "secondary.main" }}
                  >
                    {storageStats.formCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Saved Forms
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Stack
                direction="row"
                spacing={1}
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              >
                <Chip
                  label={`${
                    fields.filter((f) => f.derived?.isDerived).length
                  } Derived`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`${fields.filter((f) => f.required).length} Required`}
                  color="secondary"
                  variant="outlined"
                  size="small"
                />
                {lastSavedAt && (
                  <Chip
                    label={`Saved ${new Date(
                      lastSavedAt
                    ).toLocaleTimeString()}`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Form Configuration */}
      <Paper sx={{ p: 3, gap: 30, display: "flex", flexDirection: "column" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={3}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            label="Form Name"
            value={formName}
            onChange={(e) => dispatch(setFormName(e.target.value))}
            placeholder="e.g., Customer Registration Form"
            sx={{ flexGrow: 1, maxWidth: { xs: "100%", sm: 500 } }}
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: "text.secondary" }}>📝</Box>
              ),
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleSave}
              disabled={!canSave || !formName.trim()}
              startIcon={<SaveIcon />}
              sx={{
                minWidth: 140,
                background:
                  canSave && formName.trim()
                    ? "linear-gradient(135deg, #00b4d8 0%, #0077b6 100%)"
                    : undefined,
                transition: "all 0.2s ease-in-out",
                "&:not(:disabled)": {
                  cursor: "pointer",
                  "&:hover": {
                    cursor: "pointer",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0, 180, 216, 0.3)",
                  },
                },
                "&:disabled": {
                  cursor: "not-allowed",
                  pointerEvents: "auto",
                  opacity: 0.6,
                  "&:hover": {
                    cursor: "not-allowed",
                  },
                },
              }}
            >
              Save Form
            </Button>
            <Button
              onClick={doReset}
              color="inherit"
              variant="outlined"
              startIcon={<RefreshIcon />}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Main Builder Interface */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 3, minHeight: 600 }}>
            <FieldList />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 3, minHeight: 600 }}>
            <FieldEditor />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={saveOpen}
        onClose={() => !saving && setSaveOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background:
              resolvedMode === "dark"
                ? "linear-gradient(135deg, rgba(18, 24, 41, 0.95) 0%, rgba(26, 35, 50, 0.95) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            border:
              resolvedMode === "dark"
                ? "1px solid rgba(0, 180, 216, 0.2)"
                : "1px solid rgba(25, 118, 210, 0.2)",
          },
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AutoAwesomeIcon color="primary" />
            <Typography
              variant="h6"
              sx={{
                color: resolvedMode === "dark" ? "#f8fafc" : "#212121",
              }}
            >
              Save Your Form
            </Typography>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3}>
            <Typography
              variant="body2"
              sx={{
                color:
                  resolvedMode === "dark"
                    ? "rgba(248, 250, 252, 0.7)"
                    : "rgba(33, 33, 33, 0.7)",
              }}
            >
              Your form will be saved securely in your browser's local storage.
            </Typography>

            <Card
              sx={{
                background:
                  resolvedMode === "dark"
                    ? "rgba(0, 180, 216, 0.05)"
                    : "rgba(25, 118, 210, 0.05)",
                border:
                  resolvedMode === "dark"
                    ? "1px solid rgba(0, 180, 216, 0.1)"
                    : "1px solid rgba(25, 118, 210, 0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                >
                  📊 Form Summary
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          resolvedMode === "dark"
                            ? "rgba(248, 250, 252, 0.7)"
                            : "rgba(33, 33, 33, 0.7)",
                      }}
                    >
                      Name
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: resolvedMode === "dark" ? "#f8fafc" : "#212121",
                      }}
                    >
                      {formName}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          resolvedMode === "dark"
                            ? "rgba(248, 250, 252, 0.7)"
                            : "rgba(33, 33, 33, 0.7)",
                      }}
                    >
                      Total Fields
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: resolvedMode === "dark" ? "#f8fafc" : "#212121",
                      }}
                    >
                      {fields.length}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          resolvedMode === "dark"
                            ? "rgba(248, 250, 252, 0.7)"
                            : "rgba(33, 33, 33, 0.7)",
                      }}
                    >
                      Derived Fields
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: resolvedMode === "dark" ? "#f8fafc" : "#212121",
                      }}
                    >
                      {fields.filter((f) => f.derived?.isDerived).length}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          resolvedMode === "dark"
                            ? "rgba(248, 250, 252, 0.7)"
                            : "rgba(33, 33, 33, 0.7)",
                      }}
                    >
                      Required Fields
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        color: resolvedMode === "dark" ? "#f8fafc" : "#212121",
                      }}
                    >
                      {fields.filter((f) => f.required).length}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {saving && (
              <Box>
                <LinearProgress
                  sx={{
                    mb: 2,
                    height: 8,
                    borderRadius: 4,
                    background:
                      resolvedMode === "dark"
                        ? "rgba(0, 180, 216, 0.1)"
                        : "rgba(25, 118, 210, 0.1)",
                    "& .MuiLinearProgress-bar": {
                      background:
                        resolvedMode === "dark"
                          ? "linear-gradient(135deg, #00b4d8 0%, #14a085 100%)"
                          : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      resolvedMode === "dark"
                        ? "rgba(248, 250, 252, 0.7)"
                        : "rgba(33, 33, 33, 0.7)",
                  }}
                  align="center"
                >
                  ✨ Saving your masterpiece...
                </Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setSaveOpen(false)}
            disabled={saving}
            color="inherit"
            sx={{
              color: resolvedMode === "dark" ? "#f8fafc" : "#212121",
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={doSave}
            variant="contained"
            disabled={saving}
            startIcon={saving ? null : <SaveIcon />}
            sx={{
              background:
                resolvedMode === "dark"
                  ? "linear-gradient(135deg, #00b4d8 0%, #14a085 100%)"
                  : "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              color: "#ffffff",
              minWidth: 120,
              "&:hover": {
                background:
                  resolvedMode === "dark"
                    ? "linear-gradient(135deg, #48cae4 0%, #4db6ac 100%)"
                    : "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
              },
            }}
          >
            {saving ? "Saving..." : "Save Form"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
          variant="filled"
          sx={{
            width: "100%",
            backdropFilter: "blur(10px)",
            fontWeight: 500,
          }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
