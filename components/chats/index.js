import React, { useEffect, useRef, useState } from "react";
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
import Messages from "../messages";
import Image from "next/image";

const Chats = () => {
  const refScrollBar = useRef();
  const idMessages = uuidv4();
  const [messages, setMessages] = useState([]);

  const infoUser = useAuthUserStore((state) => state.infoUser);

  const dataUserId = infoUser[0];

  const userUID = infoUser[1].userInfo.uid;

  console.log("user UID: ", dataUserId);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", dataUserId), (doc) => {
      doc.exists() && setMessages(doc.data());
    });

    return () => {
      unsub();
    };
  }, [dataUserId]);

  const infoStatus = useAuthUserStore((state) => state.infoStatus);

  ///type mode
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };
  const currentUser = useAuthUserStore((state) => state.currentUser);

  const handleSend = async () => {
    refScrollBar.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      Inline: "start",
    });

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
                status: infoStatus,
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
          status: infoStatus,
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [dataUserId + ".lastMessages"]: {
        text,
        status: infoStatus,
      },
      [dataUserId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", userUID), {
      [dataUserId + ".lastMessages"]: {
        text,
        status: infoStatus,
      },
      [dataUserId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage(null);
    setCreateObjectURL(null);
  };

  const handleKeyEnter = (event) => {
    event.code === "Enter" && handleSend();
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

      {createObjectURL && (
        <Box
          sx={{
            height: "79vh",
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "#64686C",
          }}
        >
          <Box
            sx={{
              width: "300px",
            }}
          >
            <Image
              width={200}
              height={200}
              layout="responsive"
              src={createObjectURL}
              alt="Choose to something chat"
            />
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: createObjectURL ? "none" : "block",
          height: "79vh",
          overflow: "auto",
          p: "10px",
          py: "30px",
        }}
      >
        <Stack spacing={1}>
          {messages.messages?.map((message) => (
            <Messages message={message} key={message.id} />
          ))}
        </Stack>
        {ref && (
          <Box component="span" ref={refScrollBar} sx={{ p: "70px" }}></Box>
        )}
      </Box>
      <Box
        sx={{
          background: "#eff2f5",
          height: "11vh",
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
            onKeyDown={handleKeyEnter}
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
                onChange={uploadToClient}
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
