import React from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/home/Homepage";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import NotFound404 from "./pages/notFound/NotFound";
import EmailConfirmation from "./pages/register/EmailConfirmation";
import EmailVerified from "./pages/register/EmailVerified";
import Recovery from "./pages/recovery/Recovery";
import RecoveryConfirmation from "./pages/recovery/RecoveryConfirmation";
import RecoverPassword from "./pages/recovery/RecoverPassword";
import { createBrowserRouter, Outlet } from "react-router-dom";
import PrivateRoute from "./triggers/PrivateRoute";
import Navbar from "./components/Navbar/Navbar";
import MemberDetail from "./pages/memberDetail/MemberDetail";
import ScrollToHashElement from "./hooks/ScrollToHashElement";

const Layout = () => {
  return (
    <>
      <Navbar />
      <ScrollToHashElement />
      <div className="outlet-container h-auto min-h-screen bg-primary">
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
      {
        path: "/member-details/:userId",
        element: (
          <PrivateRoute>
            <MemberDetail />
          </PrivateRoute>
        ),
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Register /> },
      { path: "/signup/email-confirmation", element: <EmailConfirmation /> },
      { path: "/email-verified", element: <EmailVerified /> },
      { path: "/recovery", element: <Recovery /> },
      { path: "/recovery-confirmation", element: <RecoveryConfirmation /> },
      { path: "/recover-password", element: <RecoverPassword /> },
      { path: "*", element: <NotFound404 /> },
    ],
  },
]);
