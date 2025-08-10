// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { AppLayout } from "./components/layout/AppLayout";
import { CreateFormPage } from "./pages/CreateFormPage";
import { PreviewPage } from "./pages/PreviewPage";
import { MyFormsPage } from "./pages/MyFormsPage";

function App() {
  return (
    <Provider store={store}>
      <AppThemeProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/create" replace />} />
              <Route path="/create" element={<CreateFormPage />} />
              <Route path="/preview" element={<PreviewPage />} />
              <Route path="/myforms" element={<MyFormsPage />} />
            </Routes>
          </AppLayout>
        </Router>
      </AppThemeProvider>
    </Provider>
  );
}

export default App;
