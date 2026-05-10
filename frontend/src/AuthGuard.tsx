import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./services/authService";

type Props = {
  children?: React.ReactNode;
};

const AuthGuard: React.FC<Props> = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default AuthGuard;
