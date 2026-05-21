import {
  Box,
  Paper,
  Typography,
  List,
  CircularProgress,
  Fab,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState, useEffect } from "react";
import PageTitle from "../../components/custom/PageTitle";
import * as todoService from "../../services/todoService";
import TodoItem from "./comp/TodoItem";
import TodoTotal from "./comp/TodoTotal";
import AiTodoModal from "./comp/AiTodoModal";

const TodoPage: React.FC = () => {
  type Todo = todoService.ITodo;
  type ParsedTodo = todoService.IParsedTodo;

  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedTodos, setParsedTodos] = useState<ParsedTodo[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (!openModal) {
      setInputValue("");
      setEditId(null);
      setParsedTodos([]);
    }
  }, [openModal]);

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
        const newTodos = await todoService.createTodo(inputValue);

        setTodos((prev) => [...newTodos, ...prev]);
      }

      setInputValue("");

      setParsedTodos([]);

      setError(null);

      setOpenModal(false);
    } catch (err) {
      setError("Failed to save todo to MongoDB (check connection)");

      console.error("Submit error:", err);
    }
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const parsed = await todoService.parseTodos(inputValue);

      if (!parsed || parsed.length === 0) {
        setParsedTodos([]);
        setError("No tasks could be generated from the paragraph.");

        return;
      }

      setParsedTodos(parsed);

      setError(null);
    } catch (err) {
      setParsedTodos([]);
      setError("Failed to generate todos from paragraph");

      console.error("Generate error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParsedTodos = async () => {
    try {
      setLoading(true);

      const createdTodos = await todoService.createTodos(parsedTodos);

      setTodos((prev) => [...createdTodos, ...prev]);

      setParsedTodos([]);

      setInputValue("");

      setError(null);

      setOpenModal(false);
    } catch (err) {
      setError("Failed to create todos");

      console.error("Create todos error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearParsed = () => {
    setParsedTodos([]);
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

    setOpenModal(true);
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
        <Typography
          color="error"
          sx={{
            textAlign: "center",
            mb: 2,
          }}
        >
          ⚠️ {error}
        </Typography>
      )}

      <TodoTotal todos={todos} />

      {/* AI FLOATING BUTTON */}

      <Fab
        onClick={() => setOpenModal(true)}
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 70,
          height: 70,
          background: "linear-gradient(135deg,#7b2ff7,#f107a3)",
          color: "#fff",
          boxShadow: "0 0 25px rgba(123,47,247,0.5)",
          "&:hover": {
            transform: "scale(1.1)",
          },
          transition: "0.3s",
          zIndex: 1000,
        }}
      >
        <AutoAwesomeIcon
          sx={{
            fontSize: 35,
          }}
        />
      </Fab>

      {/* AI MODAL */}

      <AiTodoModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        handleGenerate={handleGenerate}
        editId={editId}
        loading={loading}
        parsedTodos={parsedTodos}
        handleClearParsed={handleClearParsed}
        handleCreateParsedTodos={handleCreateParsedTodos}
      />

      {/* TODO LIST */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            width: 1000,
            px: 1,
            maxHeight: "65vh",
            overflow: "auto",
            borderRadius: 5,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",

                p: 3,
              }}
            >
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
