import mongoose, { Document, Schema } from "mongoose";

export interface TodoUser extends Document {
  text: string;
  completed: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

const aiTodoSchema = new Schema<TodoUser>(
  {
    text: {
      type: String,
      require: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Todo", aiTodoSchema);
