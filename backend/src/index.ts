import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import aiTodoRoutes from "./routes/aiTodoRoutes";
import { connectDB } from "./config/db";
import errorHandler from "./middlewares/err-handler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/todo", aiTodoRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "AI Command Center backend is healthy" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(
    ` ✅ AI Command Center backend running on http://localhost:${PORT}`,
  );
});
