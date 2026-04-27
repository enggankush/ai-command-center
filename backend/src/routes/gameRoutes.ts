import { Router } from "express";
import {
  createGame,
  getLeaderboard,
  getUserGames,
} from "../controllers/aiGameController";
import authorization from "../middlewares/authorization";

const router = Router();
router.use(authorization);
router.post("/create", createGame);
router.get("/user", getUserGames);
router.get("/leaderboard", getLeaderboard);

export default router;
