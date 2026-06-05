export type AiTodoPriority = "high" | "medium" | "low";

export interface AiTodoItem {
  title: string;
  description?: string;
  priority: AiTodoPriority;
  category?: string;
  pointer: string;
  completed: boolean;
  source: "ai";
}
