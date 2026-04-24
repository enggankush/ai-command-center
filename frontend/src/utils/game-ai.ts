export const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const checkWinner = (board: string[]) => {
  for (let [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const isDraw = (board: string[]) => board.every((cell) => cell !== "");

export const getRandomMove = (board: string[]) => {
  const empty = board
    .map((v, i) => (v === "" ? i : null))
    .filter((v) => v !== null) as number[];
  if (empty.length === 0) return -1;
  return empty[Math.floor(Math.random() * empty.length)];
};

export const minimax = (board: string[], isMax: boolean): number => {
  const winner = checkWinner(board);

  if (winner === "O") return 1;
  if (winner === "X") return -1;
  if (isDraw(board)) return 0;

  if (isMax) {
    let best = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = "";
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = "";
      }
    }

    return best;
  }
};

export const bestMove = (board: string[]) => {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  return move;
};
