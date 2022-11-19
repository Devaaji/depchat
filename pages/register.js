import React, { useState } from "react";
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../services/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";

const RegisterPage = () => {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterFuction = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;

    console.log(displayName, email, password, uploadFiles);

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
            await router.push("/login");
            setIsLoading(false);
          });
        }
      );
    } catch (error) {
      setIsLoading(true);
      setIsError(true);
    }
  };

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
          />
          <TextField
            variant="filled"
            required
            fullWidth
            color="primary"
            id="email"
            label="email"
            name="email"
            autoFocus
          />
          <TextField
            id="outlined-password-input"
            required
            variant="filled"
            error={false}
            label="Password"
            type="password"
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
              {uploadFiles ? uploadFiles.name : "Upload your photo*"}
            </Typography>
          </Stack>

          <LoadingButton
            loading={isLoading}
            type="submit"
            sx={{
              background: "linear-gradient(to right bottom, #0889ed, #0aceec)",
              color: "white",
            }}
            fullWidth
            variant="outlined"
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

export default RegisterPage;
