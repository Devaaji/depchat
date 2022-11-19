import React, { useEffect, useState } from "react";
import { Avatar, Button, IconButton, Input, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Box from "@mui/material/Box";
import { BiImageAdd } from "react-icons/bi";
import DashboardHeaderChats from "../dashboard/dashboardHeaderChats";
import {
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebase";
import useAuthUserStore from "../../store/useAuthUserStore";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Chats = () => {
  const idMessages = uuidv4();
  const [messages, setMessages] = useState([]);

  const infoUser = useAuthUserStore((state) => state.infoUser);

  const dataUserId = infoUser[0];

  const userUID = infoUser[1].userInfo.uid;

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", dataUserId), (doc) => {
      doc.exists() && setMessages(doc.data());
    });

    return () => {
      unsub();
    };
  }, [dataUserId]);

  console.log("messages", messages);

  ///type mode
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const currentUser = useAuthUserStore((state) => state.currentUser);

  const handleSend = async () => {
    if (image) {
      const storageRef = ref(storage, idMessages);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        (error) => {
          // setIsLoading(true);
          // setIsError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", dataUserId), {
              messages: arrayUnion({
                id: idMessages,
                text: text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", dataUserId), {
        messages: arrayUnion({
          id: idMessages,
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [dataUserId + ".lastMessages"]: {
        text,
      },
      [dataUserId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", userUID), {
      [dataUserId + ".lastMessages"]: {
        text,
      },
      [dataUserId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage(null);
  };

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
          {messages.messages?.map((message) => (
            <Box
              key={message.id}
              sx={
                {
                  // border: "1px solid black",
                }
              }
            >
              <Stack
                direction={
                  message.senderId === currentUser.uid ? "row-reverse" : "row"
                }
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
                      borderRadius: "10px 0px 10px 10px",
                      background:
                        message.senderId === currentUser.uid
                          ? "#d1f1cb"
                          : "white",
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
          ))}
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
        <Stack
          direction="row"
          sx={{ p: "10px", background: "white", borderRadius: "5px" }}
        >
          <Input
            fullWidth
            placeholder="type something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Box>
            <IconButton
              color="default"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <BiImageAdd />
            </IconButton>
          </Box>
          <Box
            sx={{
              ml: "10px",
            }}
          >
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Chats;