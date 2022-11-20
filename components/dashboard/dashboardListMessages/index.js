import {
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../services/firebase";
import useAuthUserStore from "../../../store/useAuthUserStore";

const DashboardListMessages = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const currentUser = useAuthUserStore((state) => state.currentUser);

  const updateInfoStatus = useAuthUserStore((state) => state.updateInfoStatus);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  useEffect(() => {
    if (username === "") {
      setUsername("");
    }
  }, [username]);

  const handleKeyEnter = (event) => {
    event.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    const combineId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combineId));

      if (!res.exists()) {
        //create chat
        await setDoc(doc(db, "chats", combineId), { messages: [] });

        //create user chat
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combineId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combineId + ".date"]: serverTimestamp(),
        });

        //another user chat
        await updateDoc(doc(db, "userChats", user.uid), {
          [combineId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combineId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {}

    setUser(null);
    setUsername("");
  };

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);


  // const handleClickUpdateStatus = async () => {
  //   updateInfoStatus("accept");
  // };

  const updateInfoUser = useAuthUserStore((state) => state.updateInfoUser);

  return (
    <Stack spacing={0} sx={{ p: "10px" }}>
      <TextField
        id="standard-basic"
        fullWidth
        label="Find a user"
        variant="standard"
        onKeyDown={handleKeyEnter}
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <List>
        {user && (
          <ListItem
            onClick={handleSelect}
            sx={{
              borderBottom: "1px solid gray",
              background: "#F3F3F4",
              mt: "5px",
              "&:hover": {
                background: "#D3D6D9",
              },
            }}
          >
            <ListItemAvatar sx={{ border: "1px solid black" }}>
              <Avatar src={user ? user.photoURL : ""}></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user ? user.displayName : ""}
              secondary="Hello guys!"
            />
          </ListItem>
        )}
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <React.Fragment key={chat[0]}>
              {console.log("liost", chat)}
              <ListItem
                onClick={() => {
                  updateInfoUser(chat);
                  // handleClickUpdateStatus();
                }}
                sx={{
                  borderBottom: "1px solid gray",
                  background: "#F3F3F4",
                  mt: "5px",
                  "&:hover": {
                    background: "#D3D6D9",
                  },
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color={
                      chat[1].lastMessages?.status === "sended"
                        ? "success"
                        : "default"
                    }
                    variant="dot"
                  >
                    <Avatar src={chat[1].userInfo.photoURL}></Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={chat[1].userInfo.displayName}
                  secondary={chat[1].lastMessages?.text}
                />
                <Typography>
                  {dayjs.unix(chat[1].date?.seconds).format("HH:mm")}
                </Typography>
              </ListItem>
            </React.Fragment>
          ))}
      </List>
    </Stack>
  );
};

export default DashboardListMessages;
