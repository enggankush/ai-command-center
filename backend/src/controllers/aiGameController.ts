import { Request, Response, NextFunction } from "express";
import * as gameService from "../services/gameService";
import resHandler from "../middlewares/res-hadler";

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;
    const { result, mode } = req.body;

    const game = await gameService.createGame({
      userId,
      result,
      mode,
    });

    resHandler.success(res, { code: 201, data: game });
  } catch (error) {
    next(error);
  }
};

export const getUserGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = res.locals.userId;

    const games = await gameService.getUserGames(userId);

    return resHandler.success(res, {
      data: games,
      msg: "User games fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await gameService.getLeaderboard();

    return resHandler.success(res, {
      data,
      msg: "Leaderboard fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
