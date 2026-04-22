import React, { useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import Square from "./Square";

type Player = "X" | "O" | "";

const Board: React.FC = () => {
  const winPatterns: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const [boxs, setBoxs] = useState<Player[]>(Array(9).fill(""));
  const [count, setCount] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);

  const checkWinner = (newBoxs: Player[]) => {
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;

      if (
        newBoxs[a] &&
        newBoxs[a] === newBoxs[b] &&
        newBoxs[a] === newBoxs[c]
      ) {
        setWinner(newBoxs[a]);
        return;
      }
    }
  };

  const handleClick = (index: number) => {
    if (boxs[index] !== "" || winner) return;

    const newBoxs = [...boxs];
    newBoxs[index] = count % 2 === 0 ? "X" : "O";

    setBoxs(newBoxs);
    setCount(count + 1);
    checkWinner(newBoxs);
  };

  const reset = () => {
    setBoxs(Array(9).fill(""));
    setCount(0);
    setWinner(null);
  };

  return (
    <Box sx={boxStyle}>
      <Paper sx={paperStyle}>
        {boxs.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleClick(index)}
          />
        ))}
      </Paper>

      <Typography variant="h5" sx={{ mt: 4 }}>
        {winner
          ? ` 🎉 ${winner} Win tha Game!`
          : count === 9
            ? " 🤝 Draw Game!"
            : ""}
      </Typography>

      <Button variant="contained" onClick={reset} sx={buttonStyle}>
        Reset Game
      </Button>
    </Box>
  );
};

export default Board;

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mt: 4,
};

const paperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 120px)",
  gap: "20px",
  p: "20px 0 20px 20px",
  boxShadow: "0 0 1rem rgba(0,0,0,0.5)",
  borderRadius: 3,
};

const buttonStyle = {
  mt: 4,
  px: 5,
  py: 1.5,
  borderRadius: "30px",
  fontSize: "1.1rem",
};
