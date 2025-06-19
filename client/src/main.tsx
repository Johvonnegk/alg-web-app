import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const container = document.getElementById("root") as HTMLElement;
createRoot(container).render(
  <StrictMode>
    <AuthContextProvider>
      <Toaster position="bottom-right" />
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
