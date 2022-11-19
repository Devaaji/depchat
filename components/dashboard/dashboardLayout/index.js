import React from "react";
import DashboardNavbar from "../dashboardNavbar";
import Box from "@mui/material/Box";
import DashboardListMessages from "../dashboardListMessages/index";

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          flex: 1,
          boxShadow: 2,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <DashboardNavbar />
        <DashboardListMessages />
      </Box>
      <Box sx={{ flex: 1.8, background: "#e2dcd6" }}>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
