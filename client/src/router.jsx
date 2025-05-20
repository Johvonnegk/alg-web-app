import React from "react";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import Home from "./pages/home/homepage.jsx";
import About from "./pages/about/about.jsx";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import NotFound404 from "./pages/notFound/notFound.jsx";
import { createBrowserRouter, Outlet } from "react-router-dom";
import PrivateRoute from "./triggers/PrivateRoute.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="outlet-container pt-21 h-auto min-h-screen bg-primary">
        <Outlet />
      </div>
    </>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Register /> },
      { path: "*", element: <NotFound404 /> },
    ],
  },
]);
