import { TextField, type TextFieldProps } from "@mui/material";
import { type OverridableComponent } from "@mui/types";
import { type SvgIconTypeMap } from "@mui/material/SvgIcon";
import React from "react";

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  name,
  type = "text",
  label = "text",
  value = "",
  fullWidth = true,
  onChange,
  ...props
}) => {
  return (
    <TextField
      id={id}
      name={name}
      type={type}
      label={label}
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      {...props}
    />
  );
};

export default CustomTextField;

interface CustomTextFieldProps extends Omit<TextFieldProps, "variant"> {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">>; // for MUI icons
}
