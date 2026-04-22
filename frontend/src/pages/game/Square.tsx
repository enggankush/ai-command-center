import { Button } from "@mui/material";

type Props = {
  value: string | null;
  onClick: () => void;
};
const Square: React.FC<Props> = ({ value, onClick }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{ height: 100, width: 100, fontSize: "2rem", borderRadius: 20 }}
    >
      {value}
    </Button>
  );
};

export default Square;
