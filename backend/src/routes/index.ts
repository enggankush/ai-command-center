import { Router } from "express";
import authRoutes from "./authRoutes";
import aiTodoRoutes from "./aiTodoRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/todo", aiTodoRoutes);

export default router;
