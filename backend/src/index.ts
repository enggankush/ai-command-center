import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./config/db";

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

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "AI Command Center backend is healthy" });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(400).json({ message: "Something went wrong" });
  },
);

app.listen(PORT, () => {
  console.log(
    ` ✅ AI Command Center backend running on http://localhost:${PORT}`,
  );
});
