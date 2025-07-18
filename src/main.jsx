import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/routes.jsx";
import AuthProvider from "./auth/AuthProvider.jsx";
import StripeProvider from "./contexts/StripeProvider.jsx";
import QueryProvider from "./providers/QueryProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryProvider>
      <AuthProvider>
        <StripeProvider>
          <RouterProvider router={router} />
        </StripeProvider>
      </AuthProvider>
    </QueryProvider>
  </StrictMode>
);
