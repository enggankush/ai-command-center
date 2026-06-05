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

// const normalizeDueDate = (date?: string): Date => {
//   const now = new Date();

//   if (!date?.trim()) return now;

//   const cleaned = date.trim();
//   const parsed = new Date(cleaned);

//   if (Number.isNaN(parsed.getTime())) return now;
//   if (parsed < now) return now;

//   const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(cleaned);
//   if (isDateOnly) {
//     return new Date(
//       parsed.getFullYear(),
//       parsed.getMonth(),
//       parsed.getDate(),
//       12,
//       0,
//       0,
//       0,
//     );
//   }

//   return parsed;
// };

const normalizeTodoItem = (item: AiTodoItem, userId: string) => ({
  text: item.title?.trim() || "",
  description: item.description?.trim() || "",
  priority:
    item.priority === "high" ||
    item.priority === "medium" ||
    item.priority === "low"
      ? item.priority
      : "medium",
  category: normalizeCategory(item.category),
  pointer: item.pointer?.trim() || "1",
  completed: false,
  source: "ai" as const,
  userId,
});

export const parseTodos = async (paragraph: string): Promise<AiTodoItem[]> => {
  const cleaned = paragraph.trim();
  if (!cleaned) return [];

  return await generateTodosWithAI(cleaned);
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
