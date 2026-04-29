import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/todo",
});

// ✅ Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ITodo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export const getTodos = async (): Promise<ITodo[]> => {
  const res = await API.get("/");
  return res.data.data;
};

export const createTodo = async (text: string): Promise<ITodo> => {
  const res = await API.post("/", { text });
  return res.data.data;
};

export const updateTodo = async (
  id: string,
  data: { text?: string; completed?: boolean },
): Promise<ITodo> => {
  const res = await API.put(`/${id}`, data);
  return res.data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await API.delete(`/${id}`);
};
