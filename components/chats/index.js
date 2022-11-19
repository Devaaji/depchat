import React from "react";
import { Avatar, Button, IconButton, Input, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Box from "@mui/material/Box";
import { BiImageAdd } from "react-icons/bi";
import DashboardHeaderChats from "../dashboard/dashboardHeaderChats";

const Chats = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <DashboardHeaderChats />
      <Box
        sx={{
          height: "79vh",
          overflow: "auto",
          p: "10px",
        }}
      >
        <Stack spacing={1}>
          <Box
            sx={
              {
                // border: "1px solid black",
              }
            }
          >
            <Stack direction="row-reverse" spacing={1}>
              <Stack justifyContent="start">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Avatar src="https://miscmedia-9gag-fun.9cache.com/images/thumbnail-facebook/1656473044.0987_Y3UVY8_n.jpg">
                    D
                  </Avatar>
                </Box>
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  20:30
                </Typography>
              </Stack>
              <Stack py="5px">
                <Box
                  sx={{
                    p: "8px",
                    height: "max-content",
                    borderRadius: "10px 0px 10px 10px",
                    background: "#d1f1cb",
                    boxShadow: 1,
                  }}
                >
                  Kamuuu nanyaaa
                </Box>
                {/* <Box sx={{ mt: '5px'}}>
                  <img
                    width={200}
                    height={200}
                    src="https://static.republika.co.id/uploads/images/inpicture_slide/poster-solo-leveling-webcomic-yang-akan-diadaptasi-menjadi_220706173845-217.png"
                    alt="Choose to something chat"
                  />
                </Box> */}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          background: "#eff2f5",
          height: "12vh",
          py: "20px",
          px: "10px",
        }}
      >
        <Stack direction="row" sx={{ p: "10px", background: "white", borderRadius: "5px"}}>
          <Input fullWidth placeholder="type something..." />
          <Box>
            <IconButton
              color="default"
              aria-label="upload picture"
              component="label"
            >
              <input hidden accept="image/*" type="file" />
              <BiImageAdd />
            </IconButton>
          </Box>
          <Box
            sx={{
              ml: "10px",
            }}
          >
            <Button variant="contained">Send</Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Chats;
