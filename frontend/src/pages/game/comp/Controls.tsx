import { Button, Select, MenuItem, Box } from "@mui/material";

const Controls = ({ reset, mode, setMode }: any) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 20,
        mt: 3,
        flexWrap: "wrap",
      }}
    >
      <Select sx={style} value={mode} onChange={(e) => setMode(e.target.value)}>
        <MenuItem value="easy">Easy</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="hard">Hard</MenuItem>
      </Select>

      <Button sx={style} onClick={reset} variant="outlined">
        Reset game
      </Button>
    </Box>
  );
};
export default Controls;

const style = {
  mt: 2,
  px: 3,
  borderRadius: "20px",
  fontSize: "1rem",
  textTransform: "none",
};
