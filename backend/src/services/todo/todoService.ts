import { generateTodosWithAI } from "../../ai-services/aiTodoService";
import TodoModel, { ITodo } from "../../models/aiTodo";
import { AiTodoItem } from "../../types/aiTodoType";

const VALID_CATEGORIES = [
  "coding",
  "study",
  "meeting",
  "shopping",
  "health",
  "personal",
] as const;

type ValidCategory = (typeof VALID_CATEGORIES)[number];

const normalizeCategory = (category?: string): ValidCategory => {
  if (!category) return "personal";

  const normalized = category.trim().toLowerCase();
  return VALID_CATEGORIES.includes(normalized as ValidCategory)
    ? (normalized as ValidCategory)
    : "personal";
};

const normalizeDueDate = (date?: string): Date | undefined => {
  if (!date?.trim()) return undefined;

  const parsed = new Date(date.trim());
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const normalizeTodoItem = (item: AiTodoItem, userId: string) => ({
  text: item.title.trim(),
  description: item.description?.trim() || "",
  priority:
    item.priority === "high" ||
    item.priority === "medium" ||
    item.priority === "low"
      ? item.priority
      : "medium",
  category: normalizeCategory(item.category),
  dueDate: normalizeDueDate(item.dueDate),
  completed: false,
  source: "ai" as const,
  userId,
});

export const parseTodos = async (paragraph: string): Promise<AiTodoItem[]> => {
  const cleaned = paragraph.trim();
  if (!cleaned) return [];

  return generateTodosWithAI(cleaned);
};

export const createTodo = async (
  userId: string,
  paragraph: string,
): Promise<ITodo[]> => {
  const aiGeneratedTodo = await parseTodos(paragraph);

  if (aiGeneratedTodo.length === 0) return [];

  const sanitized = aiGeneratedTodo
    .filter((item) => item.title && item.title.trim().length > 0)
    .map((item) => normalizeTodoItem(item, userId));

  const savedTodo = await TodoModel.create(sanitized);
  return savedTodo;
};

export const createTodos = async (
  userId: string,
  todos: AiTodoItem[],
): Promise<ITodo[]> => {
  const sanitized = todos
    .filter((item) => item.title && item.title.trim().length > 0)
    .map((item) => normalizeTodoItem(item, userId));

  if (sanitized.length === 0) return [];

  return await TodoModel.create(sanitized);
};
