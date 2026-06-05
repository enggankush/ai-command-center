import {
  CheckCircleOutlined,
  PendingActions,
  TaskAlt,
} from "@mui/icons-material";

import { Box, Paper, Typography } from "@mui/material";

import { useMemo } from "react";

type Todo = {
  completed: boolean;
};

type Props = {
  todos: Todo[];
};

const TodoTotal: React.FC<Props> = ({ todos }) => {
  const totalTodos = todos.length;

  const completedTodos = useMemo(() => {
    return todos.filter((todo) => todo.completed).length;
  }, [todos]);

  const pendingTodos = totalTodos - completedTodos;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 4,
        m: 4,
      }}
    >
      {/* Total */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #E5E7EB",
          background: "linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ ...totalStyle, bgcolor: "#6366F1" }}>
            <TaskAlt sx={{ color: "#fff" }} />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {totalTodos}
            </Typography>

            <Typography color="text.secondary">Total Todos</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Completed */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #DCFCE7",
          background: "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ ...totalStyle, bgcolor: "#22C55E" }}>
            <CheckCircleOutlined sx={{ color: "#fff" }} />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {completedTodos}
            </Typography>

            <Typography color="text.secondary">Completed</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Pending */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: "1px solid #FED7AA",
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ ...totalStyle, bgcolor: "#F97316" }}>
            <PendingActions sx={{ color: "#fff" }} />
          </Box>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
              }}
            >
              {pendingTodos}
            </Typography>

            <Typography color="text.secondary">Pending</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default TodoTotal;

const totalStyle = {
  width: 55,
  height: 55,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
