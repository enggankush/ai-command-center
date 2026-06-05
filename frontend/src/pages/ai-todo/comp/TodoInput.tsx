import { AutoAwesome } from "@mui/icons-material";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

type Props = {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGenerate?: () => void;
  editId: string | null;
};

const MIN_LENGTH = 5;
const MAX_LENGTH = 500;

const TodoInput: React.FC<Props> = ({
  inputValue,
  setInputValue,
  onSubmit,
  onGenerate,
  editId,
}) => {
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.length > MAX_LENGTH) {
      setError(`Maximum ${MAX_LENGTH} characters allowed`);
      return;
    }
    if (inputValue.trim().length < MIN_LENGTH) {
      setError(`Minimum ${MIN_LENGTH} characters required`);
      return;
    }
    setError(null);
    onSubmit(e);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 5,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          inputRef={inputRef}
          fullWidth
          multiline
          rows={5}
          placeholder="Write all your tasks in a single paragraph..."
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;

            setInputValue(value);

            if (value.length > MAX_LENGTH) {
              setError(`Maximum ${MAX_LENGTH} characters allowed`);
            } else if (
              value.trim().length > 0 &&
              value.trim().length < MIN_LENGTH
            ) {
              setError(`Minimum ${MIN_LENGTH} characters required`);
            } else {
              setError(null);
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
              fontSize: 16,
              backgroundColor: "#FAFAFA",
            },
          }}
        />

        {/* Footer */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color={
              inputValue.length > MAX_LENGTH
                ? "error"
                : inputValue.length > MAX_LENGTH * 0.8
                  ? "warning.main"
                  : "text.secondary"
            }
          >
            {inputValue.length}/{MAX_LENGTH}
          </Typography>

          <Button
            type={editId ? "submit" : "button"}
            variant="contained"
            size="large"
            onClick={editId ? undefined : onGenerate}
            disabled={
              inputValue.trim().length < MIN_LENGTH ||
              inputValue.length > MAX_LENGTH
            }
            startIcon={<AutoAwesome />}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 4,
              py: 1.3,
              fontSize: 16,
              fontWeight: 600,
              background: "linear-gradient(90deg, #7C3AED 0%, #6366F1 100%)",
              boxShadow: "none",

              "&:hover": {
                boxShadow: "0 8px 25px rgba(124,58,237,0.25)",
              },
            }}
          >
            {editId ? "Update Todo" : "Generate Todos"}
          </Button>
        </Box>
      </form>

      {/* Error */}
      {error && (
        <Typography
          color="error"
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
          }}
        >
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default TodoInput;
