import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { session } = useAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }

  return session ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
