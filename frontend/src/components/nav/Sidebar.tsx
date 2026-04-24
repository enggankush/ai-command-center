import {
  List,
  Box,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";

import {
  AutoGraph,
  Description,
  TrackChanges,
  Chat,
  Psychology,
  Code,
  CheckCircle,
  SportsEsports,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { text: "AI Stats", icon: <AutoGraph />, path: "/ai-stats" },
  {
    text: "AI Resume Analyzer",
    icon: <Description />,
    path: "/ai-resume-analyzer",
  },
  {
    text: "AI Interview Preparation",
    icon: <TrackChanges />,
    path: "/ai-interview-prep",
  },
  { text: "AI Document Chat", icon: <Chat />, path: "/ai-document-chat" },
  { text: "Smart AI Agent Assistant", icon: <Psychology />, path: "/ai-agent" },
  { text: "AI Code Generator", icon: <Code />, path: "/ai-code-generator" },
  { text: "AI Todo App", icon: <CheckCircle />, path: "/ai-todo-app" },
  {
    text: "Tic Tac Toe Game",
    icon: <SportsEsports />,
    path: "/tic-tac-toe-game",
  },
];

const Sidebar = () => {
  const navigator = useNavigate();
  return (
    <>
      <Box sx={{}}>
        {/* Menu */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigator(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItemButton>
            <ListItemIcon sx={{ color: "red" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ color: "red", fontWeight: "bold" }}
            />
          </ListItemButton>
        </List>
      </Box>
    </>
  );
};

export default Sidebar;
