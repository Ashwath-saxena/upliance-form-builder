// src/features/library/librarySlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FormMeta } from "../../utils/storage";
import { loadIndex, deleteFormById, saveIndex } from "../../utils/storage";

type LibraryState = {
  forms: FormMeta[];
};

const initialState: LibraryState = {
  forms: [],
};

export const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    refreshFromStorage(state) {
      state.forms = loadIndex();
    },
    removeForm(state, action: PayloadAction<string>) {
      const id = action.payload;
      deleteFormById(id);
      state.forms = state.forms.filter((f) => f.id !== id);
    },
    addOrUpdateMeta(state, action: PayloadAction<FormMeta>) {
      const meta = action.payload;
      const idx = state.forms.findIndex((m) => m.id === meta.id);
      if (idx >= 0) state.forms[idx] = meta;
      else state.forms.unshift(meta);
      saveIndex(state.forms);
    },
    setForms(state, action: PayloadAction<FormMeta[]>) {
      state.forms = action.payload;
      saveIndex(state.forms);
    },
  },
});

export const { refreshFromStorage, removeForm, addOrUpdateMeta, setForms } =
  librarySlice.actions;

export default librarySlice.reducer;
