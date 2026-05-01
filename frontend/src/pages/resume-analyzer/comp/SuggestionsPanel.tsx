import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LightbulbOutlined } from "@mui/icons-material";

const SuggestionsPanel = ({ suggestions }: { suggestions?: string[] }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          💡 Suggestions for Improvement
        </Typography>
        <List>
          {suggestions.map((suggestion, i) => (
            <ListItem key={i}>
              <ListItemIcon>
                <LightbulbOutlined sx={{ color: "warning.main" }} />
              </ListItemIcon>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
export default SuggestionsPanel;
