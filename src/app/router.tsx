// src/app/router.tsx
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { CreateFormPage } from "../pages/CreateFormPage";
import { PreviewPage } from "../pages/PreviewPage";
import { MyFormsPage } from "../pages/MyFormsPage";
import { SavedFormPreviewPage } from "../pages/SavedFormPreviewPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout>
        <Navigate to="/create" replace />
      </AppLayout>
    ),
  },
  {
    path: "/create",
    element: (
      <AppLayout>
        <CreateFormPage />
      </AppLayout>
    ),
  },
  {
    path: "/preview",
    element: (
      <AppLayout>
        <PreviewPage />
      </AppLayout>
    ),
  },
  {
    path: "/myforms",
    element: (
      <AppLayout>
        <MyFormsPage />
      </AppLayout>
    ),
  },
  {
    path: "/saved-preview/:id",
    element: (
      <AppLayout>
        <SavedFormPreviewPage />
      </AppLayout>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
