// src/pages/SavedFormPreviewPage.tsx
import { useEffect, useMemo } from "react";
import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { loadFormById } from "../utils/storage";
import {
  loadFromSchema,
  setValue,
  validateAll,
} from "../features/preview/previewSlice";
import { FormFieldRenderer } from "../components/common/FormFieldRenderer";
import { useNavigate, useParams } from "react-router-dom";

export function SavedFormPreviewPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const preview = useSelector((s: RootState) => s.preview);

  const savedSchema = useMemo(() => {
    if (!id) return null;
    return loadFormById(id);
  }, [id]);

  useEffect(() => {
    if (savedSchema) {
      dispatch(loadFromSchema(savedSchema));
    }
  }, [dispatch, savedSchema]);

  if (!id) {
    return <Alert severity="error">No form ID provided</Alert>;
  }

  if (!savedSchema) {
    return (
      <Alert severity="error">Form not found. It may have been deleted.</Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <Typography variant="h5">Form Preview</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={() => dispatch(validateAll())}>
            Validate All
          </Button>
          <Button variant="outlined" onClick={() => navigate("/myforms")}>
            Back to My Forms
          </Button>
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {savedSchema.name}
        </Typography>
        <Grid container spacing={2}>
          {savedSchema.fields.map((f) => (
            <Grid key={f.id} size={{ xs: 12, md: 6 }}>
              <FormFieldRenderer
                field={f}
                value={preview.values[f.id]}
                error={preview.errors[f.id]}
                derivedError={preview.derivedErrors[f.id]}
                onChange={(id, value) => dispatch(setValue({ id, value }))}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}
