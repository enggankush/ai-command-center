import API from "./api";

export const createGame = (result: string, mode: string) => {
  return API.post("/game/create", { result, mode });
};

export const getUserGames = () => {
  return API.get("/game/user");
};

export const getLeaderboard = () => {
  return API.get("/game/leaderboard");
};
