// src/features/builder/components/FieldEditor.tsx
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Button,
  Chip,
  IconButton,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type {
  FieldSchema,
  FieldType,
  Option,
  ValidationRules,
} from "../../../utils/types";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { selectField, updateField } from "../builderSlice";
import { safeEvaluate } from "../../../utils/derived";
import { nanoid } from "@reduxjs/toolkit";

const typeChoices: FieldType[] = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
];

export function FieldEditor() {
  const fields = useSelector((s: RootState) => s.builder.fields);
  const selectedId = useSelector((s: RootState) => s.builder.selectedFieldId);

  const field = useMemo(
    () => fields.find((f) => f.id === selectedId),
    [fields, selectedId]
  );

  if (!field) {
    return (
      <Typography color="text.secondary">
        Select a field to edit its configuration.
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      <Header field={field} />
      <Basics field={field} />
      <Divider />
      <Validations field={field} />
      {(field.type === "select" || field.type === "radio") && (
        <>
          <Divider />
          <OptionsEditor field={field} />
        </>
      )}
      <Divider />
      <DerivedEditor field={field} allFields={fields} />
    </Stack>
  );
}

function Header({ field }: { field: FieldSchema }) {
  const dispatch = useDispatch();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6">Edit Field</Typography>
        <Chip label={field.id} size="small" variant="outlined" />
      </Stack>
      <Button
        onClick={() => dispatch(selectField(undefined))}
        color="inherit"
        size="small"
      >
        Deselect
      </Button>
    </Stack>
  );
}

function Basics({ field }: { field: FieldSchema }) {
  const dispatch = useDispatch();
  const onChange = (patch: Partial<FieldSchema>) =>
    dispatch(updateField({ id: field.id, patch }));

  const defaultInput =
    field.type === "textarea" ? (
      <TextField
        label="Default value"
        value={(field.defaultValue as string) ?? ""}
        onChange={(e) => onChange({ defaultValue: e.target.value })}
        fullWidth
        multiline
        minRows={3}
      />
    ) : field.type === "number" ? (
      <TextField
        label="Default value"
        type="number"
        value={(field.defaultValue as number | string) ?? ""}
        onChange={(e) =>
          onChange({
            defaultValue: e.target.value === "" ? "" : Number(e.target.value),
          })
        }
        fullWidth
      />
    ) : field.type === "checkbox" ? (
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(field.defaultValue)}
            onChange={(e) => onChange({ defaultValue: e.target.checked })}
          />
        }
        label="Default checked"
      />
    ) : field.type === "date" ? (
      <TextField
        label="Default value"
        type="date"
        value={(field.defaultValue as string) ?? ""}
        onChange={(e) => onChange({ defaultValue: e.target.value })}
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
    ) : (
      <TextField
        label="Default value"
        value={(field.defaultValue as string) ?? ""}
        onChange={(e) => onChange({ defaultValue: e.target.value })}
        fullWidth
      />
    );

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Basics</Typography>
      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => onChange({ label: e.target.value })}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          label="Type"
          value={field.type}
          onChange={(e) => onChange({ type: e.target.value as FieldType })}
        >
          {typeChoices.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Changing type may make default value incompatible.
        </FormHelperText>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={Boolean(field.required)}
            onChange={(e) => onChange({ required: e.target.checked })}
          />
        }
        label="Required"
      />

      {defaultInput}
    </Stack>
  );
}

function Validations({ field }: { field: FieldSchema }) {
  const dispatch = useDispatch();
  const rules = field.validations || {};
  const onChange = (patch: Partial<FieldSchema>) =>
    dispatch(updateField({ id: field.id, patch }));

  const patchRules = (newRules: Partial<ValidationRules>) =>
    onChange({ validations: { ...rules, ...newRules } });

  const minLength = rules.minLength;
  const maxLength = rules.maxLength;
  const hasLengthError = minLength && maxLength && minLength > maxLength;

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Validations</Typography>

      {(field.type === "text" ||
        field.type === "textarea" ||
        field.type === "number" ||
        field.type === "date" ||
        field.type === "select" ||
        field.type === "radio") && (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Min length"
              type="number"
              value={rules.minLength ?? ""}
              onChange={(e) =>
                patchRules({
                  minLength:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              sx={{ maxWidth: 180 }}
              error={Boolean(hasLengthError)}
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Max length"
              type="number"
              value={rules.maxLength ?? ""}
              onChange={(e) =>
                patchRules({
                  maxLength:
                    e.target.value === "" ? undefined : Number(e.target.value),
                })
              }
              sx={{ maxWidth: 180 }}
              error={Boolean(hasLengthError)}
              inputProps={{ min: 0 }}
            />
          </Stack>

          {hasLengthError && (
            <Fade in>
              <Alert severity="error">
                Minimum length ({minLength}) cannot be greater than maximum
                length ({maxLength})
              </Alert>
            </Fade>
          )}
        </Stack>
      )}

      {field.type === "text" && (
        <Stack direction="row" spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(rules.email)}
                onChange={(e) => patchRules({ email: e.target.checked })}
              />
            }
            label="Email format"
          />
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(rules.passwordRule)}
                onChange={(e) => patchRules({ passwordRule: e.target.checked })}
              />
            }
            label="Password rule (8+ chars, includes number)"
          />
        </Stack>
      )}
    </Stack>
  );
}

function OptionsEditor({ field }: { field: FieldSchema }) {
  const dispatch = useDispatch();
  const options = field.options ?? [];
  const setOptions = (opts: Option[]) =>
    dispatch(updateField({ id: field.id, patch: { options: opts } }));

  const add = () =>
    setOptions([
      ...options,
      {
        id: `opt_${nanoid(4)}`,
        label: `Option ${options.length + 1}`,
        value: `option${options.length + 1}`,
      },
    ]);

  const remove = (id: string) => setOptions(options.filter((o) => o.id !== id));

  const update = (id: string, patch: Partial<Option>) =>
    setOptions(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle1">Options</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={add}>
          Add option
        </Button>
      </Stack>
      <Stack spacing={1}>
        {options.length === 0 && (
          <Alert severity="info">
            Add at least one option to save this field.
          </Alert>
        )}
        {options.map((o) => (
          <Stack
            key={o.id}
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="center"
          >
            <TextField
              label="Label"
              value={o.label}
              onChange={(e) => update(o.id, { label: e.target.value })}
              fullWidth
            />
            <TextField
              label="Value"
              value={o.value}
              onChange={(e) => update(o.id, { value: e.target.value })}
              fullWidth
            />
            <IconButton color="error" onClick={() => remove(o.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function DerivedEditor({
  field,
  allFields,
}: {
  field: FieldSchema;
  allFields: FieldSchema[];
}) {
  const dispatch = useDispatch();
  const derived = field.derived || {
    isDerived: false,
    parents: [],
    formula: "",
  };
  const [testValues, setTestValues] = useState<Record<string, unknown>>({});

  const parents = useMemo(
    () => (Array.isArray(derived.parents) ? derived.parents : []),
    [derived.parents]
  );

  const availableParents = allFields.filter(
    (f) => f.id !== field.id && !f.derived?.isDerived
  );

  const onChange = (patch: Partial<FieldSchema>) =>
    dispatch(updateField({ id: field.id, patch }));

  const updateDerived = (patch: Partial<typeof derived>) => {
    const next = { ...derived, ...patch };

    if (patch.isDerived === false) {
      onChange({
        derived: undefined,
        readOnly: false,
      });
      setTestValues({});
    } else {
      onChange({
        derived: next,
        readOnly: next.isDerived ? true : field.readOnly,
      });
    }
  };

  const testResult = useMemo(() => {
    if (!derived.isDerived || !derived.formula) return null;
    const scopeValues: Record<string, unknown> = {};
    for (const p of parents) scopeValues[p] = testValues[p];
    return safeEvaluate(derived.formula, { values: scopeValues });
  }, [derived.isDerived, derived.formula, parents, testValues]);

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Derived Field</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(derived.isDerived)}
            onChange={(e) => updateDerived({ isDerived: e.target.checked })}
          />
        }
        label="Mark as derived field"
      />

      {derived.isDerived && (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="parents-label">Parent fields</InputLabel>
            <Select
              multiple
              labelId="parents-label"
              label="Parent fields"
              value={parents}
              onChange={(e) =>
                updateDerived({ parents: e.target.value as string[] })
              }
              renderValue={(vals) => (
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {(vals as string[]).map((id) => {
                    const f = allFields.find((x) => x.id === id);
                    return (
                      <Chip key={id} label={f?.label ?? id} size="small" />
                    );
                  })}
                </Box>
              )}
            >
              {availableParents.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.label}{" "}
                  <Chip
                    sx={{ ml: 1 }}
                    size="small"
                    label={p.id}
                    variant="outlined"
                  />
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Select one or more fields this field depends on.
            </FormHelperText>
          </FormControl>

          <TextField
            label="Formula"
            value={derived.formula}
            onChange={(e) => updateDerived({ formula: e.target.value })}
            fullWidth
            multiline
            minRows={2}
            placeholder="yearsBetween(values.fieldId, today())"
            helperText="Example: yearsBetween(values.dateOfBirth, today()) for age calculation"
          />

          <HelperDoc />

          <Stack spacing={1}>
            <Typography variant="subtitle2">Test Formula</Typography>
            {parents.length === 0 ? (
              <Alert severity="info">
                Select parent fields to test the formula.
              </Alert>
            ) : (
              <Stack spacing={1}>
                {parents.map((pid) => {
                  const pf = allFields.find((f) => f.id === pid);
                  return (
                    <TextField
                      key={pid}
                      label={`${pf?.label ?? pid} (${pid})`}
                      value={String(testValues[pid] ?? "")}
                      onChange={(e) =>
                        setTestValues({ ...testValues, [pid]: e.target.value })
                      }
                      fullWidth
                      size="small"
                    />
                  );
                })}

                {derived.formula && (
                  <Box sx={{ mt: 1 }}>
                    {testResult?.error ? (
                      <Alert severity="error">Error: {testResult.error}</Alert>
                    ) : (
                      <Alert severity="success">
                        Result: {String(testResult?.value ?? "")}
                      </Alert>
                    )}
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

function HelperDoc() {
  return (
    <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Formula Examples:
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
      >
        • Age from DOB: <code>yearsBetween(values.dateOfBirth, today())</code>
        <br />• Full name:{" "}
        <code>concat(values.firstName, " ", values.lastName)</code>
        <br />• Add numbers:{" "}
        <code>Number(values.field1) + Number(values.field2)</code>
        <br />• Today's date: <code>today()</code>
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        Reference parent values via <strong>values.fieldId</strong>. Available
        helpers: Number(), String(), today(), yearsBetween(), concat()
      </Typography>
    </Box>
  );
}
