import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const PrivateRoute = ({ children }) => {
  const { session } = useAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  return <>{session ? <>{children}</> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;
