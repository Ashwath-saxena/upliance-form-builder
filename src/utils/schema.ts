// src/utils/schema.ts
import { nanoid } from "@reduxjs/toolkit";
import type { FieldSchema, FormSchema } from "./types";
import { computeDerivedValues } from "./derived";
import { validateSchema } from "./validation";

export function buildFormSchema(
  name: string,
  fields: FieldSchema[]
): FormSchema {
  return {
    id: `form_${nanoid(8)}`,
    name,
    createdAt: new Date().toISOString(),
    fields,
  };
}

export function checkSchemaIssues(schema: FormSchema): {
  ok: boolean;
  errors: string[];
} {
  const val = validateSchema(schema);
  const errors = [...val.errors];
  const baseValues: Record<string, unknown> = {};
  for (const f of schema.fields) baseValues[f.id] = f.defaultValue ?? "";
  const result = computeDerivedValues(schema, baseValues);
  if (result.cycle?.hasCycle) {
    errors.push(
      `Derived cycle detected among: ${result.cycle.nodes.join(", ")}`
    );
  }
  return { ok: errors.length === 0, errors };
}
