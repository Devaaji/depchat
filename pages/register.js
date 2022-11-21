import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { BsFacebook, BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { BiImageAdd } from "react-icons/bi";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db, storage } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import useAuthUserStore from "../store/useAuthUserStore";
import { getServerSidePropsWithNoAuth } from "../utils/getServerWithNoAuth";

const RegisterPage = () => {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setLogin = useAuthUserStore((state) => state.setLogin);

  const handleRegisterFuction = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, uploadFiles);

      uploadTask.on(
        (error) => {
          setIsLoading(true);
          setIsError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL);
            await updateProfile(res.user, {
              displayName: displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: res.user.displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            await signInWithEmailAndPassword(auth, email, password).then(
              (userCredential) => {
                const user = userCredential.user;
                setLogin(
                  user.uid,
                  user.displayName,
                  user.email,
                  user.accessToken
                );
                router.reload("/");
              }
            );
            setIsLoading(false);
          });
        }
      );
    } catch (error) {
      setIsLoading(true);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (displayName.length > 0 && email.length > 0 && password.length > 0) {
      setIsButtonActive(false);
    } else {
      setIsButtonActive(true);
    }
  }, [displayName, email, password]);

  return (
    <Box
      sx={{
        background: "linear-gradient(to right top, #290fb9, #461174)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: 3,
          width: "400px",
          px: "20px",
          py: "40px",
        }}
      >
        <Box
          color="black"
          sx={{
            display: "flex",
            justifyContent: "center",
            my: "15px",
            fontSize: "22px",
            fontWeight: "bold",
          }}
        >
          <Box>Register Page</Box>
        </Box>
        <Stack
          spacing={2}
          onSubmit={handleRegisterFuction}
          component="form"
          noValidate
          autoComplete="off"
        >
          <TextField
            variant="filled"
            required
            fullWidth
            color="primary"
            id="displayName"
            label="Display Name"
            name="displayName"
            autoFocus
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            variant="filled"
            required
            fullWidth
            placeholder="example@gmail.com"
            color="primary"
            id="email"
            label="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="outlined-password-input"
            required
            variant="filled"
            error={false}
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => setUploadFiles(e.target.files[0])}
                />
                <BiImageAdd />
              </IconButton>
            </Box>
            <Typography color="gray">
              {uploadFiles ? uploadFiles.name : "Upload your photo - Max 1MB*"}
            </Typography>
          </Stack>

          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            disabled={isButtonActive}
          >
            REGISTER
          </LoadingButton>
        </Stack>
        <Stack spacing={2}>
          <Box
            sx={{
              mt: "15px",
              display: "flex",
              justifyContent: "center",
              fontWeight: "semibold",
            }}
          >
            -- OR --
          </Box>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <IconButton aria-label="google">
              <FcGoogle />
            </IconButton>
            <IconButton aria-label="facebook">
              <BsFacebook color="#38519a" />
            </IconButton>
            <IconButton aria-label="github">
              <BsGithub color="black" />
            </IconButton>
          </Stack>
          <Box sx={{ textAlign: "center" }}>
            <Typography>
              Do you have a account? <NextLink href="/login">Login</NextLink>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export const getServerSideProps = async (context) =>
  getServerSidePropsWithNoAuth(context);

export default RegisterPage;
