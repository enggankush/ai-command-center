import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TodoInput from "./TodoInput";

interface Props {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleGenerate: () => Promise<void>;
  editId: string | null;
  loading: boolean;
  parsedTodos: any[];
  handleClearParsed: () => void;
  handleCreateParsedTodos: () => Promise<void>;
}

const AiTodoModal = ({
  openModal,
  setOpenModal,
  inputValue,
  setInputValue,
  handleSubmit,
  handleGenerate,
  editId,
  loading,
  parsedTodos,
  handleClearParsed,
  handleCreateParsedTodos,
}: Props) => {
  return (
    <Dialog
      open={openModal}
      onClose={() => setOpenModal(false)}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 5,
            background: "#121826",
            color: "#fff",
            p: 2,
          },
        },
      }}
    >
      <DialogContent>
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5">✨ Generate Todos with AI</Typography>

          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ color: "#fff" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography sx={{ mb: 2 }}>
          Describe your tasks naturally and AI will generate structured todos.
        </Typography>

        {/* INPUT */}

        <TodoInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSubmit={handleSubmit}
          onGenerate={handleGenerate}
          editId={editId}
        />

        {/* LOADING */}

        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />

            <Typography sx={{ mt: 2 }}>AI is generating todos...</Typography>
          </Box>
        )}

        {/* GENERATED TODOS */}

        {parsedTodos.length > 0 && (
          <Paper
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Generated Todos
            </Typography>

            <List>
              {parsedTodos.map((todo, idx) => (
                <ListItem key={idx} divider>
                  <ListItemText
                    primary={todo.title}
                    secondary={
                      <>
                        {todo.description && (
                          <Typography variant="body2" color="text.secondary">
                            {todo.description}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <Chip
                            label={todo.priority}
                            size="small"
                            color={
                              todo.priority === "high"
                                ? "error"
                                : todo.priority === "medium"
                                  ? "warning"
                                  : "info"
                            }
                          />

                          <Chip
                            label={todo.category || "personal"}
                            size="small"
                          />

                          {todo.dueDate && (
                            <Chip label={`Due: ${todo.dueDate}`} size="small" />
                          )}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* ACTION BUTTONS */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                sx={{ ...buttonStyle, background: "#aa80f3" }}
                onClick={handleClearParsed}
              >
                Clear
              </Button>

              <Button
                variant="contained"
                sx={{ ...buttonStyle, background: "#7c3aed" }}
                onClick={handleCreateParsedTodos}
              >
                Create Todos
              </Button>
            </Box>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiTodoModal;

const buttonStyle = {
  textTransform: "none",
  borderRadius: 3,
  px: 4,
  py: 1.3,
  fontSize: 16,
  fontWeight: 600,
  background: "#aa80f3",
  boxShadow: "none",
};
