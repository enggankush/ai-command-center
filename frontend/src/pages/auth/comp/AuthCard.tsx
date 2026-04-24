import { Typography } from "@mui/material";
import type { ReactNode } from "react";

const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ marginBottom: "1.5rem", textAlign: "center" }}
      >
        {title}
      </Typography>
      {children}
    </>
  );
};

export default AuthCard;

interface AuthCardProps {
  title?: string;
  children?: ReactNode;
}
