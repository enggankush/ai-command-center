import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { EditOutlined, DeleteOutlineOutlined } from "@mui/icons-material";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};
type Props = {
  todo: Todo;
  onCheck: (id: number) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
};
const TodoItem: React.FC<Props> = ({ todo, onCheck, onEdit, onDelete }) => {
  return (
    <ListItem
      disablePadding
      divider
      sx={{
        mb: 1,
        borderRadius: 2,
        bgcolor: "#fafafa",
      }}
      secondaryAction={
        <>
          <IconButton edge="end" onClick={() => onEdit(todo)}>
            <EditOutlined sx={{ color: "#00b0ff" }} />
          </IconButton>

          <IconButton
            edge="end"
            onClick={() => onDelete(todo.id)}
            sx={{ ml: 1 }}
          >
            <DeleteOutlineOutlined sx={{ color: "#ff5252" }} />
          </IconButton>
        </>
      }
    >
      <ListItemButton onClick={() => onCheck(todo.id)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.completed}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>

        <ListItemText
          primary={todo.text}
          sx={{
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "gray" : "black",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default TodoItem;
