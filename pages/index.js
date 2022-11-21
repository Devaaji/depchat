import { Box, Stack } from "@mui/system";
import Image from "next/image";
import DashboardLayout from "../components/dashboard/dashboardLayout";
import { getServerSidePropsWithAuth } from "../utils/getServerWithAuth";
import ChooseImagesChat from "../assets/images/jpg/choose_chat.jpg";
import { Typography } from "@mui/material";
import Chats from "../components/chats";
import useAuthUserStore from "../store/useAuthUserStore";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Home() {
  const updateCurrentUser = useAuthUserStore(
    (state) => state.updateCurrentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        updateCurrentUser(user);
      } else {
        updateCurrentUser({});
      }
    });
  }, [updateCurrentUser]);

  const infoUser = useAuthUserStore((state) => state.infoUser);


  return (
    <DashboardLayout>
      {infoUser.notstate === true ? (
        <Box
          sx={{
            display: "flex",
            background: "white",
            borderLeft: "1px solid #1f2c33",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Stack
            sx={{
              textAlign: "center",
            }}
          >
            <Image
              width={400}
              height={400}
              src={ChooseImagesChat}
              alt="Choose to something chat"
              priority
            />
            <Typography variant="h5">Choose a Chat to conversation</Typography>
          </Stack>
        </Box>
      ) : (
        <Chats />
      )}
    </DashboardLayout>
  );
}

export const getServerSideProps = async (context) =>
  getServerSidePropsWithAuth(context);
