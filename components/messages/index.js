import React, { useEffect, useRef } from "react";
import { Avatar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Stack } from "@mui/system";
import useAuthUserStore from "../../store/useAuthUserStore";

const Messages = ({ message }) => {
  const infoUser = useAuthUserStore((state) => state.infoUser);
  const currentUser = useAuthUserStore((state) => state.currentUser);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [message]);

  return (
    <Box
      key={message.id}
      sx={
        {
          //   border: "1px solid black",
        }
      }
    >
      <Stack
        direction={message.senderId === currentUser.uid ? "row-reverse" : "row"}
        spacing={1}
      >
        <Stack justifyContent="start">
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Avatar
              src={
                message.senderId === currentUser.uid
                  ? currentUser.photoURL
                  : infoUser[1].userInfo.photoURL
              }
            >
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
              borderRadius:
                message.senderId === currentUser.uid
                  ? "10px 0px 10px 10px"
                  : "0px 10px 10px 10px",
              background:
                message.senderId === currentUser.uid ? "#d1f1cb" : "white",
              boxShadow: 1,
            }}
          >
            {message.text}
          </Box>
          {message.img && (
            <Box sx={{ mt: "5px" }}>
              <img
                width={200}
                height={200}
                src={message.img}
                alt="Choose to something chat"
              />
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default Messages;
