import { Button } from "@mui/material";

interface CustomButtonProps {
  text: string;
  type: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  type,
  onClick,
  disabled,
  children,
}) => {
  return (
    <Button
      fullWidth
      type={type}
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      color="primary"
      sx={{ marginTop: "1.5rem" }}
    >
      {children ? children : text}
    </Button>
  );
};

export default CustomButton;
