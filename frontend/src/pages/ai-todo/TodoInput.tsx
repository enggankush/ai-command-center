import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";

type Props = {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  editId: number | null;
};

const MIN_LENGTH = 5;
const MAX_LENGTH = 100;

const TodoInput: React.FC<Props> = ({
  inputValue,
  setInputValue,
  onSubmit,
  editId,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.length > MAX_LENGTH) {
      setError(`Max ${MAX_LENGTH} characters allowed`);
      return;
    } else if (inputValue.length < MIN_LENGTH) {
      setError(`Min ${MIN_LENGTH} characters allowed`);
      return;
    }
    setError(null);

    onSubmit(e);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: 10,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <TextField
            fullWidth
            size="medium"
            placeholder="Enter your task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={!inputValue.trim()}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </form>
      </Box>

      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TodoInput;
