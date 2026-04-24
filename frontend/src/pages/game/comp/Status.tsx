import { Typography } from "@mui/material";
type Props = {
  result: "X" | "O" | "draw" | null;
  turn: "X" | "O";
};

const Status = ({ result, turn }: Props) => {
  if (result === "draw") {
    return (
      <Typography variant="h5" sx={{ mt: 2 }}>
        <b> 🤝 Draw!</b>
      </Typography>
    );
  }
  if (result === "X" || result === "O") {
    return (
      <Typography
        variant="h5"
        sx={{
          mt: 2,
          color: result === "X" ? "#4caf50" : "#ff9800",
        }}
      >
        <b>🎉 Congratulations! {result} Wins!</b>
      </Typography>
    );
  }

  return (
    <Typography variant="h5" sx={{ mt: 2 }}>
      Turn: <b>{turn}</b>
    </Typography>
  );
};

export default Status;
