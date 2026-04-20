import { Router } from "express";
import {
  getTodos,
  createTodos,
  updateTodos,
  deleteTodos,
} from "../controllers/aiTodoController";

const router = Router();

router.get("/", getTodos);
router.post("/", createTodos);
router.put("/:id", updateTodos);
router.delete("/:id", deleteTodos);

export default router;
