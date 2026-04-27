import { Router } from "express";
import authRoutes from "./authRoutes";
import aiTodoRoutes from "./aiTodoRoutes";
import gameRoutes from "./gameRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todo", aiTodoRoutes);
router.use("/game", gameRoutes);

export default router;
