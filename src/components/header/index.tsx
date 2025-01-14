import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import { Typography } from "@mui/material";
import { open } from "@tauri-apps/plugin-dialog";
import FolderList from "./FolderList";
import { useFileStore } from "@/store/FileStore";
import { getCurrentWindow } from "@tauri-apps/api/window";

const HeaderWithDrawer: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const addFolder = useFileStore((s) => s.addFolder);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleClose = () => getCurrentWindow().close();

  const handleOpenSelector = async () => {
    try {
      const folderPath = await open({
        directory: true,
      });

      if (folderPath) {
        addFolder(folderPath);
        console.log("Selected folder:", folderPath);
      }
    } catch (error) {
      console.error("Error reading folder:", error);
    } finally {
    }
  };

  return (
    <>
      <AppBar position="static" data-tauri-drag-region>
        <Toolbar data-tauri-drag-region>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            data-tauri-drag-region
          >
            Markdown Reader
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="add"
            onClick={handleOpenSelector}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          ".MuiList-root": {
            width: "50vw",
            overflow: "scroll",
          },
        }}
      >
        <FolderList />
      </Drawer>
    </>
  );
};

export default HeaderWithDrawer;
