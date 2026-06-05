import API from "./api";

export interface ITodo {
  _id: string;
  text: string;
  description?: string;
  priority?: "high" | "medium" | "low";
  category?: string;
  pointer?: string;
  completed: boolean;
  createdAt: string;
}

export interface IParsedTodo {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  category: "coding" | "study" | "meeting" | "shopping" | "health" | "personal";
  pointer?: string;
  dueTime?: string;
  completed: boolean;
  source: "ai" | "static";
}

export const getTodos = async (): Promise<ITodo[]> => {
  const res = await API.get("/todo/");
  return res.data.data;
};

export const createTodo = async (text: string): Promise<ITodo[]> => {
  const res = await API.post("/todo/", { text });
  return res.data.data;
};

export const createTodos = async (todos: IParsedTodo[]): Promise<ITodo[]> => {
  const res = await API.post("/todo/bulk", { todos });
  return res.data.data;
};

export const parseTodos = async (text: string): Promise<IParsedTodo[]> => {
  const res = await API.post("/todo/parse", { text });
  return res.data.data;
};

export const updateTodo = async (
  id: string,
  data: { text?: string; completed?: boolean },
): Promise<ITodo> => {
  const res = await API.put(`/todo/${id}`, data);
  return res.data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await API.delete(`/todo/${id}`);
};
