import API from "./api";

export interface ITodo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const getTodos = async (): Promise<ITodo[]> => {
  const res = await API.get("/todo/");
  return res.data.data;
};

export const createTodo = async (text: string): Promise<ITodo> => {
  const res = await API.post("/todo/", { text });
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
