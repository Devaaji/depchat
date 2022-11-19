import React, { useState } from "react";
import Box from "@mui/material/Box";
import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import useAuthUserStore from "../../../store/useAuthUserStore";

const DashboardHeaderChats = () => {
  const infoUser = useAuthUserStore((state) => state.infoUser);

  return (
    <Box
      sx={{
        background: "#EEEEEB",
        height: "9vh",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "#1f2c33",
          py: "5px",
        }}
      >
        <Toolbar>
          <Avatar
            src={infoUser[1].userInfo.photoURL}
            sx={{ bgcolor: "orange" }}
          ></Avatar>
          <Typography ml="10px">{infoUser[1].userInfo.displayName}</Typography>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 2 }}
          ></IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DashboardHeaderChats;
