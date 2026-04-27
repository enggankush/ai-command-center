import Game from "../models/aiGame";

export const createGame = async (data: any) => {
  return await Game.create(data);
};

export const getUserGames = async (userId: string) => {
  return await Game.find({ userId }).sort({ createdAt: -1 });
};

export const getLeaderboard = async () => {
  return await Game.aggregate([
    {
      $group: {
        _id: "$userId",
        wins: {
          $sum: { $cond: [{ $eq: ["$result", "win"] }, 1, 0] },
        },
        losses: {
          $sum: { $cond: [{ $eq: ["$result", "loss"] }, 1, 0] },
        },
        draws: {
          $sum: { $cond: [{ $eq: ["$result", "draw"] }, 1, 0] },
        },
      },
    },
    { $sort: { wins: -1 } },
  ]);
};
