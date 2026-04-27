import { Button } from "@mui/material";

type Props = {
  value: string | null;
  onClick: () => void;
  isWinning: boolean;
};
const Square: React.FC<Props> = ({ value, onClick, isWinning }) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: "2px solid #90caf9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        cursor: "pointer",

        // 🔥 WIN HIGHLIGHT
        backgroundColor: isWinning ? "#4caf50" : "transparent",
        color: isWinning ? "#fff" : "#000",
        transition: "0.3s",
      }}
    >
      {value}
    </Button>
  );
};

export default Square;
