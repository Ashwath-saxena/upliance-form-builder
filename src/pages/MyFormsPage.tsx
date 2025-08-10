// src/pages/MyFormsPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import {
  refreshFromStorage,
  removeForm,
} from "../features/library/librarySlice";
import { useNavigate } from "react-router-dom";

export function MyFormsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forms = useSelector((s: RootState) => s.library.forms);

  const [toDelete, setToDelete] = useState<string | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(refreshFromStorage());
  }, [dispatch]);

  const sorted = useMemo(
    () => [...forms].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [forms]
  );

  const confirmDelete = () => {
    if (!toDelete) return;
    dispatch(removeForm(toDelete));
    setToDelete(null);
    setSnack({ open: true, msg: "Form deleted", severity: "success" });
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <Typography variant="h5">My Forms</Typography>
        <Button startIcon={<AddIcon />} onClick={() => navigate("/create")}>
          Create New Form
        </Button>
      </Stack>

      {sorted.length === 0 ? (
        <Box>
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate("/create")}
              >
                Create
              </Button>
            }
          >
            No saved forms yet. Create your first form in the Form Builder.
          </Alert>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {sorted.map((f) => (
            <Grid key={f.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card>
                <CardHeader
                  title={f.name}
                  subheader={formatDateTime(f.createdAt)}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Form ID: {f.id}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/preview?id=${f.id}`)}
                  >
                    Preview
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setToDelete(f.id)}
                    aria-label={`Delete ${f.name}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the saved form configuration from your
            browser's localStorage. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setToDelete(null)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
