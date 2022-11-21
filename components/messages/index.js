import React, { useEffect, useRef } from "react";
import { Avatar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Stack } from "@mui/system";
import useAuthUserStore from "../../store/useAuthUserStore";
import dayjs from "dayjs";
import { BsCheckAll } from "react-icons/bs";
import Image from "next/image";

const Messages = ({ message }) => {
  const infoUser = useAuthUserStore((state) => state.infoUser);
  const currentUser = useAuthUserStore((state) => state.currentUser);

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
          ></Box>
        </Stack>
        <Stack>
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
            {message.img && (
              <Image
                width={200}
                height={200}
                layout="responsive"
                src={message.img}
                alt="Choose to something chat"
              />
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={1}
            >
              <Box
                sx={{
                  maxWidth: "500px",
                  wordWrap: "break-word",
                }}
              >
                {message.text}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "max-content",
                  alignItems: "flex-end",
                }}
              >
                <Typography
                  sx={{
                    color: "grey",
                    fontSize: "8px",
                    textAlign: "center",
                    height: "max-content",
                  }}
                >
                  {dayjs.unix(message.date.seconds).format("HH:mm")}
                </Typography>
                {message.status && message.senderId === currentUser.uid && (
                  <BsCheckAll
                    color={message.status === "accept" ? "blue" : "gray"}
                  />
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Messages;
