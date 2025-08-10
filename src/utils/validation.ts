// src/utils/validation.ts
import type { FieldSchema, FormSchema } from "./types";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function validateStrongPassword(value: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (value.length < 8) issues.push("At least 8 characters");
  if (!/\d/.test(value)) issues.push("Must contain a number");

  return { isValid: issues.length === 0, issues };
}

export function validateField(
  value: unknown,
  field: FieldSchema
): string | null {
  const rules = field.validations || {};
  const str = value == null ? "" : String(value);

  if (rules.required) {
    if (field.type === "checkbox") {
      if (value !== true) return "This field is required";
    } else {
      if (str.trim().length === 0) return "This field is required";
    }
  }

  if (!rules.required && str.trim().length === 0) {
    return null;
  }

  if (typeof rules.minLength === "number" && str.length < rules.minLength) {
    return `Minimum length is ${rules.minLength} characters`;
  }

  if (typeof rules.maxLength === "number" && str.length > rules.maxLength) {
    return `Maximum length is ${rules.maxLength} characters`;
  }

  if (rules.email) {
    if (str && !emailRegex.test(str))
      return "Please enter a valid email address";
  }

  if (rules.passwordRule) {
    if (str.length < 8 || !/\d/.test(str)) {
      return "Password must be at least 8 characters and contain a number";
    }
  }

  return null;
}

export function validateSchema(schema: FormSchema): {
  ok: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const ids = new Set<string>();

  if (!schema.id || !schema.name || !schema.fields) {
    errors.push("Schema is missing required properties");
    return { ok: false, errors };
  }

  if (!Array.isArray(schema.fields)) {
    errors.push("Fields must be an array");
    return { ok: false, errors };
  }

  for (const f of schema.fields) {
    if (!f.id || !f.type || !f.label) {
      errors.push(`Field is missing required properties: ${JSON.stringify(f)}`);
      continue;
    }

    if (ids.has(f.id)) {
      errors.push(`Duplicate field id: ${f.id}`);
    }
    ids.add(f.id);

    if (
      (f.type === "select" || f.type === "radio") &&
      (!f.options || f.options.length === 0)
    ) {
      errors.push(`Field "${f.label}" requires at least one option`);
    }

    if (f.options) {
      f.options.forEach((opt, idx) => {
        if (!opt.id || !opt.label || typeof opt.value === "undefined") {
          errors.push(`Field "${f.label}" has invalid option at index ${idx}`);
        }
      });
    }

    if (f.derived?.isDerived) {
      if (!f.derived.parents || f.derived.parents.length === 0) {
        errors.push(`Derived field "${f.label}" has no parent fields`);
      }

      if (!f.derived.formula) {
        errors.push(`Derived field "${f.label}" has no formula`);
      }

      for (const p of f.derived.parents) {
        const parentExists = schema.fields.some((ff) => ff.id === p);
        if (!parentExists) {
          errors.push(
            `Derived field "${f.label}" references non-existent parent: ${p}`
          );
        }
        if (p === f.id) {
          errors.push(`Field "${f.label}" cannot derive from itself`);
        }
      }
    }

    if (f.defaultValue !== undefined && f.validations) {
      const defaultError = validateField(f.defaultValue, f);
      if (defaultError) {
        errors.push(
          `Field "${f.label}" has invalid default value: ${defaultError}`
        );
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function validateForm(
  values: Record<string, unknown>,
  schema: FormSchema
) {
  const out: Record<string, string | null> = {};
  for (const f of schema.fields) {
    out[f.id] = validateField(values[f.id], f);
  }
  return out;
}
