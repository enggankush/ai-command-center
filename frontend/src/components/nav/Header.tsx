import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import { Person, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import PageTitle from "../custom/PageTitle";

interface User {
  fullName: string;
  email: string;
  profileImage?: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const storedUser = localStorage.getItem("currentUser");

  let user: User | null = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setAnchorEl(null);
    navigate("/login", { replace: true });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const updatedUser = {
        ...user,
        profileImage: reader.result as string,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      window.location.reload();
    };

    reader.readAsDataURL(file);
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "#778d82",
      }}
    >
      <Toolbar>
        {/* Logo + Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src="/favicon.png"
            alt="logo"
            sx={{
              width: 36,
              height: 36,
              mr: 1,
            }}
          />

          <PageTitle
            title="AI Command Center"
            style={{
              marginBottom: 0,
              color: "#fff",
            }}
          />
        </Box>

        {/* Right Side */}
        <Box sx={{ ml: "auto" }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls={open ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              src={user?.profileImage}
              sx={{
                bgcolor: "#1565c0",
                width: 45,
                height: 45,
                fontWeight: 600,
              }}
            >
              {!user?.profileImage &&
                (user?.fullName?.[0]?.toUpperCase() || "U")}
            </Avatar>
          </IconButton>

          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                elevation: 4,
                sx: {
                  width: 280,
                  mt: 1,
                  borderRadius: 2,
                },
              },
            }}
          >
            {/* User Information */}
            <Box
              sx={{
                px: 2,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#f6f8fa",
              }}
            >
              <Avatar
                src={user?.profileImage}
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#1565c0",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                }}
              >
                {!user?.profileImage &&
                  (user?.fullName?.[0]?.toUpperCase() || "U")}
              </Avatar>

              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {user?.fullName || "User"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {user?.email || "user@example.com"}
                </Typography>
              </Box>
            </Box>
            <Divider />
            {/* Upload Profile Photo */}
            <MenuItem component="label">
              Upload Profile Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </MenuItem>
            <Divider />

            {/* Profile */}
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <Divider />

            {/* Logout */}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>

              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
