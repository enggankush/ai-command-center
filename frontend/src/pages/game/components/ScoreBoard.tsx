import { Box, Paper, Typography } from "@mui/material";

const ScoreBoard = ({ score }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
      }}
    >
      {/* X Player */}
      <Paper sx={boxStyle("#4fd1c5")}>
        <Typography variant="body2">X (YOU)</Typography>
        <Typography variant="h5">{score.X}</Typography>
      </Paper>

      {/* Draw */}
      <Paper sx={boxStyle("#cbd5e1")}>
        <Typography variant="body2">Draw</Typography>
        <Typography variant="h5">{score.draw}</Typography>
      </Paper>

      {/* O Player */}
      <Paper sx={boxStyle("#f6ad55")}>
        <Typography variant="body2">O (AI)</Typography>
        <Typography variant="h5">{score.O}</Typography>
      </Paper>
    </Box>
  );
};

export default ScoreBoard;

const boxStyle = (bg: string) => ({
  backgroundColor: bg,
  minWidth: 110,
  textAlign: "center",
  py: 1.5,
  borderRadius: 2,
  fontWeight: "bold",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
});
