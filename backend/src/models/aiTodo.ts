import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

const TodoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
      default: "general",
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ["ai", "manual"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  },
);

TodoSchema.set("toJSON", {
  transform: (_doc, ret: any) => {
    ret._id = ret._id?.toString?.() ?? ret._id;
    ret.id = ret._id;
    delete ret.__v;
  },
});

const TodoModel = mongoose.model("Todo", TodoSchema);

export type ITodo = HydratedDocument<InferSchemaType<typeof TodoSchema>>;

export default TodoModel;
