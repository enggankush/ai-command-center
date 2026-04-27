import { Box, Paper } from "@mui/material";
import Square from "./Square";

type Props = {
  boxs: string[];
  onClick: (i: number) => void;
  winningCells: number[];
};

const Board = ({ boxs, onClick, winningCells }: Props) => {
  return (
    <Box sx={boxStyle}>
      <Paper sx={paperStyle}>
        {boxs.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => onClick(index)}
            isWinning={winningCells.includes(index)}
          />
        ))}
      </Paper>
    </Box>
  );
};

export default Board;

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mt: 3,
};

const paperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 120px)",
  gap: "20px",
  p: "20px",
  boxShadow: "0 0 1rem rgba(0,0,0,0.5)",
  borderRadius: 3,
};
