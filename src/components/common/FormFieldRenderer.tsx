// src/components/common/FormFieldRenderer.tsx
import { memo, useCallback } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Zoom,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useTheme } from "@mui/material/styles";
import type { FieldSchema } from "../../utils/types";

type Props = {
  field: FieldSchema;
  value: unknown;
  error?: string | null;
  derivedError?: string | null;
  onChange: (id: string, value: unknown) => void;
};

export const FormFieldRenderer = memo(
  ({ field, value, error, derivedError, onChange }: Props) => {
    const theme = useTheme();
    const isDerived = Boolean(field.derived?.isDerived) || field.readOnly;
    const hasError = Boolean(error || derivedError);
    const errorMessage = error || derivedError || null;

    const handleChange = useCallback(
      (newValue: unknown) => {
        if (!isDerived) {
          onChange(field.id, newValue);
        }
      },
      [field.id, onChange, isDerived]
    );

    const handleNumberInput = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
          [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          (e.keyCode === 90 && e.ctrlKey === true) ||
          (e.keyCode >= 35 && e.keyCode <= 40)
        ) {
          return;
        }

        if (
          (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
          (e.keyCode < 96 || e.keyCode > 105)
        ) {
          e.preventDefault();
        }
      },
      []
    );

    const handleNumberPaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = e.clipboardData.getData("text");

        if (!/^-?\d*\.?\d*$/.test(paste)) {
          e.preventDefault();
        }
      },
      []
    );

    const getAriaProps = () => ({
      "aria-required": field.required,
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `${field.id}-error` : undefined,
    });

    const renderLabel = () => (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <span>
          {field.label}
          {field.required && <span style={{ color: "red" }}> *</span>}
        </span>
        {isDerived && (
          <Tooltip
            title="This field is automatically calculated"
            arrow
            TransitionComponent={Zoom}
          >
            <InfoIcon fontSize="small" color="primary" />
          </Tooltip>
        )}
      </Stack>
    );

    const getTextFieldSx = () => ({
      "& .MuiOutlinedInput-root": {
        backgroundColor: isDerived
          ? theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)"
          : theme.palette.mode === "dark"
          ? "rgba(248, 250, 252, 0.05)"
          : "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        "& fieldset": {
          borderColor: isDerived
            ? theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)"
            : theme.palette.mode === "dark"
            ? "rgba(0, 180, 216, 0.3)"
            : "rgba(25, 118, 210, 0.3)",
        },
        "&:hover fieldset": {
          borderColor: isDerived
            ? theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.3)"
              : "rgba(0, 0, 0, 0.3)"
            : theme.palette.mode === "dark"
            ? "rgba(0, 180, 216, 0.6)"
            : "rgba(25, 118, 210, 0.6)",
        },
        "&.Mui-focused fieldset": {
          borderColor: theme.palette.mode === "dark" ? "#00b4d8" : "#1976d2",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 0 0 3px rgba(0, 180, 216, 0.1)"
              : "0 0 0 3px rgba(25, 118, 210, 0.1)",
        },
        "& input": {
          color: isDerived
            ? theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.7)"
            : theme.palette.text.primary,
          "&::placeholder": {
            color:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)",
          },
        },
        "& textarea": {
          color: isDerived
            ? theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.7)"
              : "rgba(0, 0, 0, 0.7)"
            : theme.palette.text.primary,
          "&::placeholder": {
            color:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.5)"
                : "rgba(0, 0, 0, 0.5)",
          },
        },
      },
      "& .MuiInputLabel-root": {
        color: isDerived
          ? theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.6)"
            : "rgba(0, 0, 0, 0.6)"
          : theme.palette.mode === "dark"
          ? "rgba(248, 250, 252, 0.7)"
          : "rgba(30, 41, 59, 0.7)",
        "&.Mui-focused": {
          color: theme.palette.mode === "dark" ? "#00b4d8" : "#1976d2",
        },
      },
      ...(hasError && {
        animation: "shake 0.5s ease-in-out",
        "@keyframes shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
      }),
    });

    switch (field.type) {
      case "text":
      case "textarea": {
        const isTextarea = field.type === "textarea";

        return (
          <FormControl fullWidth error={hasError}>
            <TextField
              label={renderLabel()}
              type="text"
              value={formatValue(value, field.type)}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isDerived}
              multiline={isTextarea}
              minRows={isTextarea ? 3 : undefined}
              maxRows={isTextarea ? 6 : undefined}
              fullWidth
              variant="outlined"
              sx={getTextFieldSx()}
              {...getAriaProps()}
            />
            {errorMessage && (
              <FormHelperText id={`${field.id}-error`} error>
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      case "number": {
        return (
          <FormControl fullWidth error={hasError}>
            <TextField
              label={renderLabel()}
              type="text"
              value={formatValue(value, field.type)}
              onChange={(e) => {
                const newValue = e.target.value.replace(/[^0-9.-]/g, "");
                handleChange(newValue === "" ? "" : Number(newValue));
              }}
              onKeyDown={handleNumberInput}
              onPaste={handleNumberPaste}
              disabled={isDerived}
              fullWidth
              variant="outlined"
              sx={getTextFieldSx()}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              {...getAriaProps()}
            />
            {errorMessage && (
              <FormHelperText id={`${field.id}-error`} error>
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      case "date": {
        return (
          <FormControl fullWidth error={hasError}>
            <TextField
              label={renderLabel()}
              type="date"
              value={formatValue(value, field.type)}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isDerived}
              InputLabelProps={{ shrink: true }}
              fullWidth
              variant="outlined"
              sx={getTextFieldSx()}
              {...getAriaProps()}
            />
            {errorMessage && (
              <FormHelperText id={`${field.id}-error`} error>
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      case "select": {
        return (
          <FormControl fullWidth error={hasError}>
            <InputLabel id={`${field.id}-label`}>{renderLabel()}</InputLabel>
            <Select
              labelId={`${field.id}-label`}
              label={field.label}
              value={String(value ?? "")}
              onChange={(e) => handleChange(e.target.value)}
              disabled={isDerived}
              sx={{
                backgroundColor: isDerived
                  ? theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)"
                  : theme.palette.mode === "dark"
                  ? "rgba(248, 250, 252, 0.05)"
                  : "rgba(255, 255, 255, 0.9)",
                "& .MuiSelect-select": {
                  color: isDerived
                    ? theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)"
                    : theme.palette.text.primary,
                },
              }}
              {...getAriaProps()}
            >
              {(field.options ?? []).map((opt) => (
                <MenuItem key={opt.id} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errorMessage && (
              <FormHelperText id={`${field.id}-error`} error>
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      case "radio": {
        return (
          <FormControl component="fieldset" error={hasError} fullWidth>
            <Stack spacing={1}>
              {renderLabel()}
              <RadioGroup
                value={String(value ?? "")}
                onChange={(e) => handleChange(e.target.value)}
                sx={{
                  "& .MuiFormControlLabel-root": {
                    opacity: isDerived ? 0.6 : 1,
                    "& .MuiFormControlLabel-label": {
                      color: isDerived
                        ? theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.7)"
                          : "rgba(0, 0, 0, 0.7)"
                        : theme.palette.text.primary,
                    },
                  },
                }}
              >
                {(field.options ?? []).map((opt) => (
                  <FormControlLabel
                    key={opt.id}
                    value={opt.value}
                    control={<Radio />}
                    label={opt.label}
                    disabled={isDerived}
                  />
                ))}
              </RadioGroup>
              {errorMessage && (
                <FormHelperText id={`${field.id}-error`} error>
                  {errorMessage}
                </FormHelperText>
              )}
            </Stack>
          </FormControl>
        );
      }

      case "checkbox": {
        return (
          <FormControl error={hasError} fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(value)}
                  onChange={(e) => handleChange(e.target.checked)}
                  disabled={isDerived}
                  {...getAriaProps()}
                />
              }
              label={renderLabel()}
              sx={{
                opacity: isDerived ? 0.6 : 1,
                alignItems: "flex-start",
                "& .MuiCheckbox-root": {
                  paddingTop: "6px",
                },
                "& .MuiFormControlLabel-label": {
                  color: isDerived
                    ? theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(0, 0, 0, 0.7)"
                    : theme.palette.text.primary,
                },
              }}
            />
            {errorMessage && (
              <FormHelperText id={`${field.id}-error`} error sx={{ ml: 0 }}>
                {errorMessage}
              </FormHelperText>
            )}
          </FormControl>
        );
      }

      default:
        return (
          <Stack spacing={1}>
            <FormHelperText error>
              Unsupported field type: {field.type}
            </FormHelperText>
          </Stack>
        );
    }
  }
);

function formatValue(value: unknown, type: string) {
  if (value == null) return "";

  switch (type) {
    case "number":
      return value === "" ? "" : String(value);
    case "date":
    case "text":
    case "textarea":
    default:
      return String(value);
  }
}
