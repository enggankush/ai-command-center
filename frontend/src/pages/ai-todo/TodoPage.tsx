import { Box, Paper, Typography, List } from "@mui/material";
import { useState, useEffect } from "react";
import PageTitle from "../../components/custom/PageTitle";

import TodoInput from "./TodoInput";
import TodoItem from "./TodoItem";

const TodoPage: React.FC = () => {
  type Todo = {
    id: number;
    text: string;
    completed: boolean;
  };
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      return storedTodos ? JSON.parse(storedTodos) : [];
    } catch {
      return [];
    }
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editId !== null) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editId ? { ...todo, text: inputValue } : todo,
        ),
      );
      setEditId(null);
    } else {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
      };
      setTodos((prev) => [newTodo, ...prev]);
    }

    setInputValue("");
  };

  const handleCheck = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };
  const handleEdit = (todo: Todo) => {
    setInputValue(todo.text);
    setEditId(todo.id);
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  return (
    <>
      <PageTitle title="AI To-Do App" />
      <TodoInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSubmit={handleSubmit}
        editId={editId}
      />

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper sx={{ width: 800, px: 1, maxHeight: "65vh", overflow: "auto" }}>
          {todos.length === 0 ? (
            <Typography align="center">No tasks added yet...</Typography>
          ) : (
            <List>
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
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
