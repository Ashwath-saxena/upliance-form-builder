// src/app/providers/AppProviders.tsx
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { AppThemeProvider } from "../../contexts/ThemeContext";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <AppThemeProvider>{children}</AppThemeProvider>
    </Provider>
  );
}
