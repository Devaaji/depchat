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
import React from "react";
import { MdAddAPhoto } from "react-icons/md";
import useAuthUserStore from "../../../store/useAuthUserStore";

const ModalCurrentProfile = ({ open, handleClose }) => {
  const currentUser = useAuthUserStore((state) => state.currentUser);

  console.log("user", currentUser);

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
          <List sx={{ border:'1px solid white', width: '100%', mt: '25px'}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                    1
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                    2
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCurrentProfile;
