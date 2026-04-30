import { Router } from "express";
import authRoutes from "./authRoutes";
import aiTodoRoutes from "./aiTodoRoutes";
import gameRoutes from "./gameRoutes";
import aiResumeRoutes from "./aiResumeRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todo", aiTodoRoutes);
router.use("/game", gameRoutes);
router.use("/resume", aiResumeRoutes);

export default router;
