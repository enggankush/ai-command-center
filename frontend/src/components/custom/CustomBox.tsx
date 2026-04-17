import { Box } from "@mui/material";
import type { ReactNode } from "react";

const CustomBox: React.FC<CustomBoxProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "8rem",
        padding: "2rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {children}
    </Box>
  );
};

export default CustomBox;

interface CustomBoxProps {
  children: ReactNode;
}
