import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/home/homepage.jsx";
import About from "./pages/about/about.jsx";
import Login from "./pages/login/login.jsx";
import NotFound404 from "./pages/notFound/notFound.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "*", element: <NotFound404 /> },
  { path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
