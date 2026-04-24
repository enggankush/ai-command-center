import { Box } from "@mui/material";
import useGame from "../../hooks/useGame";
import PageTitle from "../../components/custom/PageTitle";
import Board from "./comp/Board";
import Status from "./comp/Status";
import Controls from "./comp/Controls";
import ScoreBoard from "./comp/ScoreBoard";

const GamePage = () => {
  const game = useGame();

  return (
    <>
      <PageTitle title="Tic-Tac-Toe Game" />
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <ScoreBoard score={game.score} />

        <Status result={game.result} turn={game.turn} />

        <Board boxs={game.boxs} onClick={game.handleClick} />

        <Controls reset={game.reset} mode={game.mode} setMode={game.setMode} />
      </Box>
    </>
  );
};

export default GamePage;
