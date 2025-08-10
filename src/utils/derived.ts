// src/utils/derived.ts
import type { FieldSchema, FormSchema } from "./types";

export type DerivedComputeResult = {
  nextValues: Record<string, unknown>;
  errorsByField: Record<string, string | null>;
  cycle?: { hasCycle: true; nodes: string[] };
};

type Graph = {
  indegree: Map<string, number>;
  adj: Map<string, Set<string>>;
};

export type FormulaTemplate = {
  id: string;
  name: string;
  description: string;
  category: "date" | "text" | "math" | "logic";
  template: string;
  generate: (params: Record<string, string>) => string;
  params: Array<{
    name: string;
    type: "field" | "value";
    fieldType?: string[];
    label: string;
    placeholder?: string;
    required?: boolean;
  }>;
  example?: string;
};

export const FORMULA_TEMPLATES: FormulaTemplate[] = [
  {
    id: "age_from_dob",
    name: "Calculate Age",
    description: "Calculate age in years from date of birth",
    category: "date",
    template: "Calculate age from {dateField}",
    generate: (params) => `yearsBetween(values.${params.dateField}, today())`,
    params: [
      {
        name: "dateField",
        type: "field",
        fieldType: ["date"],
        label: "Date of Birth Field",
        required: true,
      },
    ],
    example: "If DOB is 1990-05-15, result will be 34 (as of 2024)",
  },
  {
    id: "full_name",
    name: "Combine Full Name",
    description: "Combine first name and last name with a space",
    category: "text",
    template: "Combine {firstName} and {lastName}",
    generate: (params) =>
      `concat(values.${params.firstName}, " ", values.${params.lastName})`,
    params: [
      {
        name: "firstName",
        type: "field",
        fieldType: ["text"],
        label: "First Name Field",
        required: true,
      },
      {
        name: "lastName",
        type: "field",
        fieldType: ["text"],
        label: "Last Name Field",
        required: true,
      },
    ],
    example: "John + Doe = John Doe",
  },
  {
    id: "add_numbers",
    name: "Add Numbers",
    description: "Add two or more number fields together",
    category: "math",
    template: "Add {field1} + {field2}",
    generate: (params) =>
      `Number(values.${params.field1} || 0) + Number(values.${params.field2} || 0)`,
    params: [
      {
        name: "field1",
        type: "field",
        fieldType: ["number"],
        label: "First Number Field",
        required: true,
      },
      {
        name: "field2",
        type: "field",
        fieldType: ["number"],
        label: "Second Number Field",
        required: true,
      },
    ],
    example: "10 + 5 = 15",
  },
  {
    id: "multiply_numbers",
    name: "Multiply Numbers",
    description: "Multiply two number fields",
    category: "math",
    template: "Multiply {field1} × {field2}",
    generate: (params) =>
      `Number(values.${params.field1} || 0) * Number(values.${params.field2} || 0)`,
    params: [
      {
        name: "field1",
        type: "field",
        fieldType: ["number"],
        label: "First Number Field",
        required: true,
      },
      {
        name: "field2",
        type: "field",
        fieldType: ["number"],
        label: "Second Number Field",
        required: true,
      },
    ],
    example: "10 × 5 = 50",
  },
  {
    id: "percentage_calculation",
    name: "Calculate Percentage",
    description: "Calculate percentage of a number",
    category: "math",
    template: "{percentage}% of {field}",
    generate: (params) =>
      `Math.round((Number(values.${params.field} || 0) * ${params.percentage}) / 100)`,
    params: [
      {
        name: "field",
        type: "field",
        fieldType: ["number"],
        label: "Number Field",
        required: true,
      },
      {
        name: "percentage",
        type: "value",
        label: "Percentage",
        placeholder: "e.g., 10 for 10%",
        required: true,
      },
    ],
    example: "10% of 100 = 10",
  },
  {
    id: "conditional_adult",
    name: "Adult/Minor Status",
    description: "Check if age qualifies as adult (18+) or minor",
    category: "logic",
    template: 'If {ageField} >= 18 then "Adult" else "Minor"',
    generate: (params) =>
      `Number(values.${params.ageField} || 0) >= 18 ? "Adult" : "Minor"`,
    params: [
      {
        name: "ageField",
        type: "field",
        fieldType: ["number"],
        label: "Age Field",
        required: true,
      },
    ],
    example: "Age 25 = Adult, Age 16 = Minor",
  },
  {
    id: "format_phone",
    name: "Format Phone Number",
    description: "Format 10-digit phone number with dashes",
    category: "text",
    template: "Format phone {phoneField}",
    generate: (params) =>
      `String(values.${params.phoneField} || "").replace(/^(\\d{3})(\\d{3})(\\d{4})$/, "$1-$2-$3")`,
    params: [
      {
        name: "phoneField",
        type: "field",
        fieldType: ["text", "number"],
        label: "Phone Number Field",
        required: true,
      },
    ],
    example: "1234567890 → 123-456-7890",
  },
  {
    id: "days_difference",
    name: "Days Between Dates",
    description: "Calculate number of days between two dates",
    category: "date",
    template: "Days between {startDate} and {endDate}",
    generate: (params) =>
      `Math.abs(Math.ceil((new Date(values.${params.endDate}) - new Date(values.${params.startDate})) / (1000 * 60 * 60 * 24)))`,
    params: [
      {
        name: "startDate",
        type: "field",
        fieldType: ["date"],
        label: "Start Date Field",
        required: true,
      },
      {
        name: "endDate",
        type: "field",
        fieldType: ["date"],
        label: "End Date Field",
        required: true,
      },
    ],
    example: "2024-01-01 to 2024-01-15 = 14 days",
  },
];

export function validateTemplate(
  templateId: string,
  params: Record<string, string>
): { valid: boolean; errors: string[] } {
  const template = FORMULA_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return { valid: false, errors: ["Template not found"] };
  }

  const errors: string[] = [];

  for (const param of template.params) {
    if (param.required && !params[param.name]) {
      errors.push(`${param.label} is required`);
    }

    if (param.type === "value" && params[param.name]) {
      if (
        templateId === "percentage_calculation" &&
        param.name === "percentage"
      ) {
        const val = Number(params[param.name]);
        if (isNaN(val) || val < 0 || val > 100) {
          errors.push("Percentage must be a number between 0 and 100");
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function generateFormulaFromTemplate(
  templateId: string,
  params: Record<string, string>
): { formula: string; error: string | null } {
  const validation = validateTemplate(templateId, params);
  if (!validation.valid) {
    return { formula: "", error: validation.errors.join(", ") };
  }

  const template = FORMULA_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    return { formula: "", error: "Template not found" };
  }

  try {
    const formula = template.generate(params);
    return { formula, error: null };
  } catch (error) {
    return {
      formula: "",
      error: `Failed to generate formula: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

function buildDependencyGraph(schema: FormSchema): Graph {
  const indegree = new Map<string, number>();
  const adj = new Map<string, Set<string>>();

  for (const f of schema.fields) {
    indegree.set(f.id, 0);
    adj.set(f.id, new Set());
  }

  for (const f of schema.fields) {
    if (f.derived?.isDerived) {
      for (const p of f.derived.parents) {
        if (!adj.has(p)) adj.set(p, new Set());
        adj.get(p)!.add(f.id);
        indegree.set(f.id, (indegree.get(f.id) || 0) + 1);
      }
    }
  }

  return { indegree, adj };
}

function topoSort(graph: Graph): { order: string[]; hasCycle: boolean } {
  const indeg = new Map(graph.indegree);
  const q: string[] = [];
  const order: string[] = [];

  for (const [node, deg] of indeg) {
    if (deg === 0) q.push(node);
  }

  while (q.length) {
    const u = q.shift()!;
    order.push(u);
    const nexts = graph.adj.get(u);
    if (nexts) {
      for (const v of nexts) {
        indeg.set(v, (indeg.get(v) || 0) - 1);
        if (indeg.get(v) === 0) q.push(v);
      }
    }
  }

  const hasCycle = order.length !== indeg.size;
  return { order, hasCycle };
}

function yearsBetween(a: unknown, b: unknown): number {
  const d1 = a ? new Date(String(a)) : null;
  const d2 = b ? new Date(String(b)) : null;
  if (!d1 || isNaN(d1.getTime()) || !d2 || isNaN(d2.getTime())) return 0;
  let diff = d2.getFullYear() - d1.getFullYear();
  const m = d2.getMonth() - d1.getMonth();
  if (m < 0 || (m === 0 && d2.getDate() < d1.getDate())) diff--;
  return Math.max(0, diff);
}

function today(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function concat(...args: unknown[]): string {
  return args.map((a) => String(a ?? "")).join("");
}

export function safeEvaluate(
  formula: string,
  scope: { values: Record<string, unknown> }
): { value: unknown; error: string | null } {
  const helpers = {
    Number,
    String,
    today,
    yearsBetween,
    concat,
    Math,
  };

  try {
    const contextKeys = ["values", ...Object.keys(helpers)];
    const contextValues = [scope.values, ...Object.values(helpers)];

    const fn = new Function(
      ...contextKeys,
      `"use strict"; return (${formula});`
    );
    const result = fn(...contextValues);
    return { value: result, error: null };
  } catch (e) {
    return {
      value: "",
      error: `Formula error: ${
        e instanceof Error ? e.message : "Unknown error"
      }`,
    };
  }
}

export function computeDerivedValues(
  schema: FormSchema,
  values: Record<string, unknown>
): DerivedComputeResult {
  const { indegree, adj } = buildDependencyGraph(schema);
  const { order, hasCycle } = topoSort({ indegree, adj });

  const fieldMap = new Map<string, FieldSchema>(
    schema.fields.map((f) => [f.id, f])
  );
  const nextValues: Record<string, unknown> = { ...values };
  const errorsByField: Record<string, string | null> = {};

  if (hasCycle) {
    const cycleNodes: string[] = [];
    for (const [node, deg] of indegree) {
      if (deg > 0) cycleNodes.push(node);
    }
    for (const id of cycleNodes) {
      const f = fieldMap.get(id);
      if (f?.derived?.isDerived) {
        errorsByField[id] = "Circular dependency detected";
      }
    }
    return {
      nextValues,
      errorsByField,
      cycle: { hasCycle: true, nodes: cycleNodes },
    };
  }

  for (const id of order) {
    const f = fieldMap.get(id);
    if (!f || !f.derived?.isDerived) continue;

    const { value, error } = safeEvaluate(f.derived.formula, {
      values: nextValues,
    });
    if (error) {
      errorsByField[id] = error;
      if (nextValues[id] === undefined) nextValues[id] = "";
    } else {
      nextValues[id] = value;
      errorsByField[id] = null;
    }
  }

  return { nextValues, errorsByField };
}

export function getTemplatesByCategory(category?: string): FormulaTemplate[] {
  if (!category) return FORMULA_TEMPLATES;
  return FORMULA_TEMPLATES.filter((t) => t.category === category);
}

export function getCompatibleTemplates(
  availableFieldTypes: string[]
): FormulaTemplate[] {
  return FORMULA_TEMPLATES.filter((template) =>
    template.params.some(
      (param) =>
        param.type === "field" &&
        param.fieldType?.some((type) => availableFieldTypes.includes(type))
    )
  );
}
