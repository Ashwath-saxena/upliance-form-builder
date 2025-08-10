// src/features/builder/builderSlice.ts
import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FieldSchema, FieldType } from "../../utils/types";

type BuilderState = {
  fields: FieldSchema[];
  selectedFieldId?: string;
  formName?: string;
  lastSavedAt?: string;
};

const initialState: BuilderState = {
  fields: [],
};

function defaultFieldFor(type: FieldType): FieldSchema {
  const id = `fld_${nanoid(6)}`;
  const base: FieldSchema = {
    id,
    type,
    label: `New ${type[0].toUpperCase()}${type.slice(1)} Field`,
    required: false,
    order: Date.now(),
  };
  if (type === "select" || type === "radio") {
    base.options = [
      { id: `opt_${nanoid(4)}`, label: "Option 1", value: "option1" },
      { id: `opt_${nanoid(4)}`, label: "Option 2", value: "option2" },
    ];
  }
  if (type === "checkbox") {
    base.defaultValue = false;
  } else {
    base.defaultValue = "";
  }
  return base;
}

export const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    addField(state, action: PayloadAction<FieldType>) {
      const field = defaultFieldFor(action.payload);
      state.fields.push(field);
      state.selectedFieldId = field.id;
    },
    selectField(state, action: PayloadAction<string | undefined>) {
      state.selectedFieldId = action.payload;
    },
    updateField(
      state,
      action: PayloadAction<{ id: string; patch: Partial<FieldSchema> }>
    ) {
      const { id, patch } = action.payload;
      const idx = state.fields.findIndex((f) => f.id === id);
      if (idx === -1) return;

      const currentField = state.fields[idx];

      if (patch.derived === undefined) {
        const updatedField = { ...currentField, ...patch };
        updatedField.derived = undefined;
        updatedField.readOnly = false;
        state.fields[idx] = updatedField;
      } else {
        state.fields[idx] = { ...currentField, ...patch };
      }
    },
    moveField(
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down" }>
    ) {
      const { id, direction } = action.payload;
      const idx = state.fields.findIndex((f) => f.id === id);
      if (idx === -1) return;
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= state.fields.length) return;
      const tmp = state.fields[idx];
      state.fields[idx] = state.fields[swapWith];
      state.fields[swapWith] = tmp;
    },
    deleteField(state, action: PayloadAction<string>) {
      const id = action.payload;
      const hasDependents = state.fields.some(
        (f) => f.derived?.isDerived && f.derived.parents.includes(id)
      );
      if (hasDependents) {
        return;
      }

      state.fields.forEach((field) => {
        if (field.derived?.parents?.includes(id)) {
          field.derived.parents = field.derived.parents.filter(
            (pid) => pid !== id
          );

          if (field.derived.parents.length === 0) {
            field.derived = undefined;
            field.readOnly = false;
          }
        }
      });

      state.fields = state.fields.filter((f) => f.id !== id);
      if (state.selectedFieldId === id) state.selectedFieldId = undefined;
    },
    setFormName(state, action: PayloadAction<string | undefined>) {
      state.formName = action.payload;
    },
    setFields(state, action: PayloadAction<FieldSchema[]>) {
      state.fields = action.payload;
    },
    resetBuilder() {
      return { ...initialState };
    },
    setLastSavedAt(state, action: PayloadAction<string | undefined>) {
      state.lastSavedAt = action.payload;
    },
  },
});

export const {
  addField,
  selectField,
  updateField,
  moveField,
  deleteField,
  setFormName,
  setFields,
  resetBuilder,
  setLastSavedAt,
} = builderSlice.actions;

export default builderSlice.reducer;
