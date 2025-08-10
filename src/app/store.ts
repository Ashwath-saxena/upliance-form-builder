// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "../features/builder/builderSlice";
import libraryReducer from "../features/library/librarySlice";
import previewReducer from "../features/preview/previewSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
    library: libraryReducer,
    preview: previewReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
