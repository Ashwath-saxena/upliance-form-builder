// src/features/preview/previewSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FormSchema, FieldSchema } from "../../utils/types";
import { computeDerivedValues } from "../../utils/derived";

interface PreviewState {
  schema: FormSchema | null;
  values: Record<string, unknown>;
  errors: Record<string, string | null>;
  derivedErrors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitAttempted: boolean;
}

const initialState: PreviewState = {
  schema: null,
  values: {},
  errors: {},
  derivedErrors: {},
  touched: {},
  isSubmitting: false,
  submitAttempted: false,
};

function validateEmailWithDomains(email: string): boolean {
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "mail.com",
    "yandex.com",
    "zoho.com",
    "fastmail.com",
    "tutanota.com",
  ];

  const domainPattern = allowedDomains
    .map((d) => d.replace(".", "\\."))
    .join("|");
  const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${domainPattern})$`, "i");

  return emailRegex.test(email);
}

function validateFieldValue(value: unknown, field: FieldSchema): string | null {
  if (field.required) {
    if (value === null || value === undefined || value === "") {
      return "This field is required";
    }
    if (field.type === "checkbox" && !value) {
      return "This field is required";
    }
  }

  if (!value || value === "") {
    return null;
  }

  const stringValue = String(value);
  const rules = field.validations || {};

  if (rules.minLength && stringValue.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  if (rules.email) {
    if (!validateEmailWithDomains(stringValue)) {
      return "Please enter a valid email address with a recognized domain (e.g., @gmail.com, @yahoo.com, @outlook.com)";
    }
  }

  if (rules.passwordRule) {
    if (stringValue.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/\d/.test(stringValue)) {
      return "Password must contain at least one number";
    }
  }

  return null;
}

const previewSlice = createSlice({
  name: "preview",
  initialState,
  reducers: {
    loadFromSchema: (state, action: PayloadAction<FormSchema>) => {
      const schema = action.payload;
      state.schema = schema;

      const initialValues: Record<string, unknown> = {};
      schema.fields.forEach((field) => {
        initialValues[field.id] =
          field.defaultValue ?? (field.type === "checkbox" ? false : "");
      });

      state.values = initialValues;
      state.errors = {};
      state.derivedErrors = {};
      state.touched = {};
      state.isSubmitting = false;
      state.submitAttempted = false;

      const derivedResult = computeDerivedValues(schema, initialValues);
      state.values = derivedResult.nextValues;
      state.derivedErrors = derivedResult.errorsByField;
    },

    setValue: (
      state,
      action: PayloadAction<{ id: string; value: unknown }>
    ) => {
      if (!state.schema) return;

      const { id, value } = action.payload;
      state.values[id] = value;

      state.touched[id] = true;

      const field = state.schema.fields.find((f) => f.id === id);
      if (field && !field.derived?.isDerived) {
        const error = validateFieldValue(value, field);
        state.errors[id] = error;
      }

      const derivedResult = computeDerivedValues(state.schema, state.values);
      state.values = derivedResult.nextValues;
      state.derivedErrors = derivedResult.errorsByField;

      if (state.submitAttempted) {
        state.submitAttempted = false;
      }
    },

    validateAll: (state) => {
      if (!state.schema) return;

      console.log("=== validateAll: Starting validation ===");

      state.schema.fields.forEach((field) => {
        state.touched[field.id] = true;
      });

      const newErrors: Record<string, string | null> = {};

      state.schema.fields.forEach((field) => {
        if (!field.derived?.isDerived) {
          const fieldValue = state.values[field.id];
          const error = validateFieldValue(fieldValue, field);
          newErrors[field.id] = error;

          console.log(`Field ${field.label} (${field.id}):`, {
            value: fieldValue,
            required: field.required,
            error: error,
          });
        }
      });

      state.errors = newErrors;

      const derivedResult = computeDerivedValues(state.schema, state.values);
      state.values = derivedResult.nextValues;
      state.derivedErrors = derivedResult.errorsByField;

      state.submitAttempted = true;

      console.log("=== validateAll: Final errors ===", state.errors);
    },

    submitForm: (state) => {
      if (!state.schema) return;

      state.submitAttempted = true;
      state.isSubmitting = true;

      state.schema.fields.forEach((field) => {
        state.touched[field.id] = true;
      });

      const newErrors: Record<string, string | null> = {};

      state.schema.fields.forEach((field) => {
        if (!field.derived?.isDerived) {
          const fieldValue = state.values[field.id];
          const error = validateFieldValue(fieldValue, field);
          newErrors[field.id] = error;
        }
      });

      state.errors = newErrors;

      const derivedResult = computeDerivedValues(state.schema, state.values);
      state.values = derivedResult.nextValues;
      state.derivedErrors = derivedResult.errorsByField;

      state.isSubmitting = false;
    },

    resetSubmitState: (state) => {
      state.submitAttempted = false;
    },
  },
});

export const {
  loadFromSchema,
  setValue,
  validateAll,
  submitForm,
  resetSubmitState,
} = previewSlice.actions;
export default previewSlice.reducer;
