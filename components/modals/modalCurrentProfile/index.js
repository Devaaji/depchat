import {
  Avatar,
  Badge,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import React, { useState } from "react";
import { BsFillPersonFill, BsFillTelephonePlusFill } from "react-icons/bs";
import { MdAddAPhoto, MdEmail } from "react-icons/md";
import useAuthUserStore from "../../../store/useAuthUserStore";
import ModalEditProfile from "../modalEditProfile";

const ModalCurrentProfile = ({ open, handleClose }) => {
  const currentUser = useAuthUserStore((state) => state.currentUser);
  const updateInfoStatusProfile = useAuthUserStore(
    (state) => state.updateInfoStatusProfile
  );

  const [openEdit, setOpenEdit] = useState(false);

  const handleOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const styleModal = {
    position: "absolute",
    borderRadius: "10px",
    color: "white",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#1f2c33",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={styleModal}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "max-content" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton
                  aria-label="upload picture"
                  component="label"
                  sx={{
                    backgroundColor: "gray",
                    "&:hover": {
                      background: "gray",
                    },
                  }}
                >
                  <input hidden accept="image/*" type="file" />
                  <MdAddAPhoto />
                </IconButton>
              }
            >
              <Avatar
                alt="Remy Sharp"
                src={currentUser.photoURL}
                sx={{ width: 130, height: 130 }}
              />
            </Badge>
          </Box>
          <List
            sx={{
              width: "100%",
              mt: "25px",
            }}
          >
            <ListItem
              disablePadding
              onClick={() => {
                handleOpenEdit();
                updateInfoStatusProfile({
                  nameLabel: "Display Name",
                  nameValue: currentUser.displayName,
                });
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <BsFillPersonFill color="white" />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography color="white">Display Name</Typography>}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline", color: "gray" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {currentUser.displayName}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => {
                handleOpenEdit();
                updateInfoStatusProfile({
                  nameLabel: "Email",
                  nameValue: currentUser.email,
                });
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <MdEmail color="white" />
                </ListItemIcon>
                <ListItemText
                  primary="Email"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline", color: "gray" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {currentUser.email}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
            <ListItem
              disablePadding
              onClick={() => {
                handleOpenEdit();
                updateInfoStatusProfile({
                  nameLabel: "Phone Number",
                  nameValue: currentUser.phoneNumber,
                });
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <BsFillTelephonePlusFill color="white" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone Number"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline", color: "gray" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {currentUser.phoneNumber
                          ? currentUser.phoneNumber
                          : "-"}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <ModalEditProfile open={openEdit} handleClose={handleCloseEdit} />
      </Box>
    </Modal>
  );
};

export default ModalCurrentProfile;
