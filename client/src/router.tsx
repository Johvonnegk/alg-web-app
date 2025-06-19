import React from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/homepage";
import About from "./pages/about/About";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound404 from "./pages/notFound/notFound";
import { createBrowserRouter, Outlet } from "react-router-dom";
import PrivateRoute from "./triggers/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";

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
