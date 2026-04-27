import { Schema, model } from "mongoose";

const aigameSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    result: {
      type: String,
      enum: ["win", "loss", "draw"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
  },
  { timestamps: true },
);

const Game = model("Game", aigameSchema);

export default Game;
