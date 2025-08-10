// src/utils/types.ts
export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

export type Option = {
  id: string;
  label: string;
  value: string;
};

export type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean;
};

export type DerivedConfig = {
  isDerived: boolean;
  parents: string[];
  formula: string;
};

export type FieldValue = string | number | boolean | undefined;

export type FieldSchema = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  defaultValue?: FieldValue;
  validations?: ValidationRules;
  options?: Option[];
  derived?: DerivedConfig;
  order: number;
  readOnly?: boolean;
};

export type FormSchema = {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldSchema[];
};
