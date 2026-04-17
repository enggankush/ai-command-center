import { Typography } from "@mui/material";

const PageTitle = ({ title, style }: { title: string; style?: any }) => {
  return (
    <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", ...style }}>
      {title}
    </Typography>
  );
};

export default PageTitle;
