import { Router } from "express";
import authorization from "../middlewares/authorization";
import {
  getTodo,
  createTodo,
  parseTodo,
  createBulkTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/aiTodoController";

const router = Router();

router.use(authorization);
router.get("/", getTodo);
router.post("/", createTodo);
router.post("/parse", parseTodo);
router.post("/bulk", createBulkTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
