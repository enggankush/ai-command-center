import { useState, useEffect, useRef } from "react";
import { checkWinner, isDraw, getRandomMove, bestMove } from "../utils/ai";

type Player = "X" | "O" | "";
type Result = "X" | "O" | "draw" | null;

const useGame = () => {
  const [boxs, setBoxs] = useState<Player[]>(Array(9).fill(""));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const [mode, setMode] = useState<"easy" | "medium" | "hard">("easy");

  const clickSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  const drawSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSound.current = new Audio("/sounds/click.mp3");
    winSound.current = new Audio("/sounds/win.mp3");
    loseSound.current = new Audio("/sounds/lose.mp3");
    drawSound.current = new Audio("/sounds/draw.mp3");
  }, []);

  // ✅ safer play
  const play = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (!ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  const handleClick = (index: number) => {
    if (boxs[index] || result || turn !== "X") return;

    const newBoard = [...boxs];
    newBoard[index] = "X";

    setBoxs(newBoard);
    setTurn("O");
    play(clickSound);
  };

  useEffect(() => {
    // ✅ WIN CHECK FIRST
    const win = checkWinner(boxs);

    if (win === "X" || win === "O") {
      setResult(win);

      setScore((prev) => ({
        ...prev,
        [win]: prev[win] + 1,
      }));

      if (win === "X") {
        play(winSound);
      } else {
        play(loseSound);
      }

      return;
    }

    // ✅ DRAW CHECK SECOND
    if (isDraw(boxs)) {
      setResult("draw");
      setScore((prev) => ({ ...prev, draw: prev.draw + 1 }));
      play(drawSound);
      return;
    }

    if (result) return;

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
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [boxs, turn, mode, result]);

  // ✅ reset on mode change
  useEffect(() => {
    setBoxs(Array(9).fill(""));
    setTurn("X");
    setResult(null);
  }, [mode]);

  const reset = () => {
    setBoxs(Array(9).fill(""));
    setTurn("X");
    setResult(null);
  };

  return {
    boxs,
    turn,
    result,
    score,
    mode,
    setMode,
    handleClick,
    reset,
  };
};

export default useGame;
