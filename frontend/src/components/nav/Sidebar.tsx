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

const menuItems = [
  { text: "AI Analytics", icon: <AutoGraph /> },
  { text: "AI Resume Analyzer", icon: <Description /> },
  { text: "AI Interview Preparation", icon: <TrackChanges /> },
  { text: "AI Document Chat", icon: <Chat /> },
  { text: "Smart AI Agent Assistant", icon: <Psychology /> },
  { text: "AI Code Generator", icon: <Code /> },
  { text: "AI Todo App", icon: <CheckCircle /> },
  { text: "Tic Tac Toe Game", icon: <SportsEsports /> },
];

const Sidebar = () => {
  return (
    <>
      <Box sx={{}}>
        {/* Menu */}
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
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
