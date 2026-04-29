import { Box, Paper, Typography, List, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import PageTitle from "../../components/custom/PageTitle";
import * as todoService from "../../services/todoService";
import TodoInput from "./comp/TodoInput";
import TodoItem from "./comp/TodoItem";

const TodoPage: React.FC = () => {
  type Todo = todoService.ITodo;

  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      const localTodos = localStorage.getItem("todos");
      if (localTodos) {
        try {
          setTodos(JSON.parse(localTodos));
          setError("Using offline data (MongoDB unavailable)");
        } catch {
          setError("Failed to load todos");
        }
      } else {
        setError("Failed to load todos");
      }
      console.error("Fetch todos error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editId !== null) {
        const updatedTodo = await todoService.updateTodo(editId, {
          text: inputValue,
        });
        setTodos((prev) =>
          prev.map((todo) => (todo._id === editId ? updatedTodo : todo)),
        );
        setEditId(null);
      } else {
        const newTodo = await todoService.createTodo(inputValue);
        setTodos((prev) => [newTodo, ...prev]);
      }
      setInputValue("");
      setError(null);
    } catch (err) {
      setError("Failed to save todo to MongoDB (check connection)");
      console.error("Submit error:", err);
    }
  };

  const handleCheck = async (id: string) => {
    try {
      const todo = todos.find((t) => t._id === id);
      if (todo) {
        const updatedTodo = await todoService.updateTodo(id, {
          completed: !todo.completed,
        });
        setTodos((prev) => prev.map((t) => (t._id === id ? updatedTodo : t)));
        setError(null);
      }
    } catch (err) {
      setError("Failed to update todo in MongoDB");
      console.error("Check error:", err);
    }
  };
  const handleEdit = (todo: Todo) => {
    setInputValue(todo.text);
    setEditId(todo._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete todo from MongoDB");
      console.error("Delete error:", err);
    }
  };
  return (
    <>
      <PageTitle title="AI To-Do App" />
      {error && (
        <Typography color="error" sx={{ textAlign: "center", mb: 2 }}>
          ⚠️ {error}
        </Typography>
      )}
      <TodoInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleSubmit}
        editId={editId}
      />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper sx={{ width: 800, px: 1, maxHeight: "65vh", overflow: "auto" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : todos.length === 0 ? (
            <Typography align="center" sx={{ p: 3 }}>
              No tasks added yet...
            </Typography>
          ) : (
            <List>
              {todos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onCheck={handleCheck}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default TodoPage;
