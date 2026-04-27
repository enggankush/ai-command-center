import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/game",
});

// ✅ attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createGame = (result: string, mode: string) => {
  return API.post("/create", { result, mode });
};

export const getUserGames = () => {
  return API.get("/user");
};

export const getLeaderboard = () => {
  return API.get("/leaderboard");
};
