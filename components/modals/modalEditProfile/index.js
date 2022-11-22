import { Box, Button, Modal, TextField } from "@mui/material";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../../../services/firebase";
import useAuthUserStore from "../../../store/useAuthUserStore";

const ModalEditProfile = ({ open, handleClose }) => {
  const [editProfile, setEditProfile] = useState("");

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  const currentUser = useAuthUserStore((state) => state.currentUser);

  const infoStatusProfile = useAuthUserStore(
    (state) => state.infoStatusProfile
  );

  const handleEditProfile = async () => {
    if (infoStatusProfile.nameLabel === "Display Name") {
      await updateProfile(auth.currentUser, {
        displayName: editProfile,
      })
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [dataUserId + ".lastMessages"]: {
          text,
          status: infoStatus,
        },
      }).then(() => {
        handleClose();
      });
    }
    if (infoStatusProfile.nameLabel === "Email") {
      await updateProfile(auth.currentUser, {
        email: editProfile,
      }).then(() => {
        handleClose();
      });
    }
    if (infoStatusProfile.nameLabel === "Phone Number") {
      await updateProfile(auth.currentUser, {
        phoneNumber: editProfile,
      }).then(() => {
        handleClose();
      });
    }
  };

  const handleKeyEnter = (event) => {
    event.code === "Enter" && handleEditProfile();
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          <Box>
            <TextField
              fullWidth
              id="standard-basic"
              label={infoStatusProfile.nameLabel}
              defaultValue={
                infoStatusProfile.nameValue ? infoStatusProfile.nameValue : "-"
              }
              variant="standard"
              onKeyDown={handleKeyEnter}
              onChange={(e) => setEditProfile(e.target.value)}
            />
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default ModalEditProfile;
