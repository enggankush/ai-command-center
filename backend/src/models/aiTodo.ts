import mongoose, { Document, Schema } from "mongoose";

export interface ITodo extends Document {
  text: string;
  completed: boolean;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const aiTodoSchema = new Schema<ITodo>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

// ✅ add generic
const Todo = mongoose.model<ITodo>("Todo", aiTodoSchema);

export default Todo;
