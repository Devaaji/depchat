import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { auth } from "../../../services/firebase";
import useAuthUserStore from "../../../store/useAuthUserStore";

const DashboardNavbar = () => {
  const setLogout = useAuthUserStore((state) => state.setLogout);
  const currentUser = useAuthUserStore((state) => state.currentUser);
  const router = useRouter();

  const handleLogout = async () => {
    await setLogout();
    await router.push("/login");
    await signOut(auth);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          background: "#1f2c33",
          borderRight: "1px solid gray",
          py: "5px",
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Box component="div" sx={{ flexGrow: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Tooltip title={currentUser.displayName} arrow>
                <Avatar src={currentUser.photoURL}></Avatar>
              </Tooltip>
            </Stack>
          </Box>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            color="inherit"
            onClick={handleClick}
          >
            <FiMoreVertical />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DashboardNavbar;
