import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Fade,
  IconButton,
  Slide,
  TextField,
  Typography,
} from "@mui/material";

import NextLink from "next/link";
import { Box, Stack } from "@mui/system";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, db, providerGoogle } from "../services/firebase";
import { useRouter } from "next/router";
import { getServerSidePropsWithNoAuth } from "../utils/getServerWithNoAuth";
import useAuthUserStore from "../store/useAuthUserStore";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook, BsGithub } from "react-icons/bs";
import { LoadingButton } from "@mui/lab";
import { doc, setDoc } from "firebase/firestore";

const LoginPages = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const setLogin = useAuthUserStore((state) => state.setLogin);
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setLogin(user.uid, user.displayName, user.email, user.accessToken);
        router.push("/");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        setIsError(true);
      });
  };

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setIsButtonActive(false);
    } else {
      setIsButtonActive(true);
    }
  }, [email, password]);

  //login google
  const handleSigninWithGoogle = async () => {
    try {
      await signInWithPopup(auth, providerGoogle)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user", user);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          console.log(errorCode);
          const errorMessage = error.message;
          // The email of the user's account used.
          console.log(errorMessage);
          const email = error.customData.email;
          console.log(email);
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          console.log(credential);
        });

      // await updateProfile(user, {
      //   displayName: user.displayName,
      //   photoURL: user.photoURL,
      // });
      // await setDoc(doc(db, "users", user.uid), {
      //   uid: user.uid,
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL,
      // });
      // await setDoc(doc(db, "userChats", user.uid), {});
      // await setLogin(user.uid, user.displayName, user.email, user.accessToken);
      // router.reload("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSiginWithFacebook = () => {};

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
          <Box>Login Page</Box>
        </Box>
        {isError && (
          <Fade direction="up" in={isError} mountOnEnter unmountOnExit>
            <Alert severity="error">Ups! wrong email and password</Alert>
          </Fade>
        )}
        <Stack
          onSubmit={handleLogin}
          spacing={3}
          component="form"
          noValidate
          autoComplete="off"
        >
          <TextField
            margin="normal"
            variant="filled"
            required
            fullWidth
            color="primary"
            id="email"
            label="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <TextField
            id="outlined-password-input"
            required
            variant="filled"
            error={false}
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <LoadingButton
            type="submit"
            loading={isLoading}
            fullWidth
            variant="contained"
            disabled={isButtonActive}
          >
            Login
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
            <IconButton aria-label="google" onClick={handleSigninWithGoogle}>
              <FcGoogle />
            </IconButton>
            <IconButton aria-label="facebook" onClick={handleSiginWithFacebook}>
              <BsFacebook color="#38519a" />
            </IconButton>
            <IconButton aria-label="github">
              <BsGithub color="black" />
            </IconButton>
          </Stack>
          <Box sx={{ textAlign: "center" }}>
            <Typography>
              Do you have a account?{" "}
              <NextLink href="/register">Register</NextLink>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export const getServerSideProps = async (context) =>
  getServerSidePropsWithNoAuth(context);

export default LoginPages;
