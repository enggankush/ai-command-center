import { useState, useEffect, useRef } from "react";
import { checkWinner, isDraw, getRandomMove, bestMove } from "../utils/game-ai";
import * as gameService from "../services/gameService";

type Player = "X" | "O" | "";
type Result = "X" | "O" | "draw" | null;
type Score = {
  X: number;
  O: number;
  draw: number;
};

const useGame = () => {
  const [boxs, setBoxs] = useState<Player[]>(Array(9).fill(""));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [result, setResult] = useState<Result>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [mode, setMode] = useState<"easy" | "medium" | "hard">("easy");
  const [score, setScore] = useState<Score>(() => {
    const saved = localStorage.getItem("score");
    return saved ? JSON.parse(saved) : { X: 0, O: 0, draw: 0 };
  });

  const clickSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  const drawSound = useRef<HTMLAudioElement | null>(null);
  const hasSaved = useRef(false);

  useEffect(() => {
    clickSound.current = new Audio("/sounds/click.mp3");
    winSound.current = new Audio("/sounds/win.mp3");
    loseSound.current = new Audio("/sounds/lose.mp3");
    drawSound.current = new Audio("/sounds/draw.mp3");
  }, []);

  /* ================= SAVE SCORE ================= */
  useEffect(() => {
    localStorage.setItem("score", JSON.stringify(score));
  }, [score]);

  // ✅ safer play
  const play = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (!ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  /* ================= HANDLE CLICK ================= */
  const handleClick = (index: number) => {
    if (boxs[index] || result || turn !== "X") return;

    const newBoard = [...boxs];
    newBoard[index] = "X";

    setBoxs(newBoard);
    setTurn("O");
    play(clickSound);
  };

  /* ================= GAME LOGIC ================= */
  useEffect(() => {
    if (result) return;

    const win = checkWinner(boxs);

    // ✅ WIN CHECK FIRST
    if (win) {
      const { winner, pattern } = win;

      setResult(winner as "X" | "O");
      setWinningCells(pattern);

      setScore((prev) => ({
        ...prev,
        [winner]: prev[winner] + 1,
      }));

      if (winner === "X") {
        play(winSound);
      } else {
        play(loseSound);
      }

      return;
    }

    // ✅ DRAW CHECK SECOND
    if (isDraw(boxs)) {
      setResult("draw");

      setScore((prev) => ({
        ...prev,
        draw: prev.draw + 1,
      }));
      play(drawSound);

      return;
    }

    // ✅ AI TURN
    if (turn === "O") {
      const timer = setTimeout(() => {
        let move: number;

        if (mode === "easy") {
          move = getRandomMove(boxs);
        } else if (mode === "medium") {
          move =
            Math.random() < 0.5 ? getRandomMove(boxs) : bestMove([...boxs]);
        } else {
          move = bestMove([...boxs]);
        }

        if (move === -1) return;

        const newBoard = [...boxs];
        newBoard[move] = "O";

        setBoxs(newBoard);
        setTurn("X");
        play(clickSound);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [boxs, turn, mode, result]);

  /* ================= SAVE GAME ================= */
  useEffect(() => {
    if (!result || hasSaved.current) return;

    hasSaved.current = true;

    const saveGame = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        let finalResult: "win" | "loss" | "draw";

        if (result === "X") finalResult = "win";
        else if (result === "O") finalResult = "loss";
        else finalResult = "draw";

        await gameService.createGame(finalResult, mode);
        console.log("Game saved");
      } catch (err) {
        console.error("Save game failed", err);
      }
    };

    saveGame();
  }, [result, mode]);

  /* ================= RESET ON MODE ================= */
  useEffect(() => {
    reset();
  }, [mode]);

  /* ================= RESET ================= */
  const reset = () => {
    setBoxs(Array(9).fill(""));
    setTurn("X");
    setResult(null);
    setWinningCells([]);
    hasSaved.current = false;
  };

  return {
    boxs,
    turn,
    result,
    score,
    mode,
    setMode,
    winningCells,
    handleClick,
    reset,
  };
};

export default useGame;
