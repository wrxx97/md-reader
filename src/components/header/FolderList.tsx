import { useEffect, Fragment, useRef } from "react";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/Inbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useFileStore } from "@/store/FileStore";
import { readDir } from "@tauri-apps/plugin-fs";
import { useShallow } from "zustand/react/shallow";
import { isEqual } from "lodash-es";
import useUpdate from "@/hooks/useUpdate";

const FolderList = () => {
  const { folders, updateFolder, setSelectedFiles, setCurrentDir } =
    useFileStore(
      useShallow((state) => {
        return {
          setSelectedFiles: state.setSelectedFiles,
          folders: state.folders,
          updateFolder: state.updateFolder,
          setCurrentDir: state.setCurrentDir,
        };
      })
    );

  const filesRef = useRef(new Map<string, Map<string, string[]>>());
  const forceUpdate = useUpdate();

  const handleSelectFile = async (
    folderId: string,
    filename: string,
    exts: string[]
  ) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      const { folderPath } = folder;
      const filePaths = exts.map((ext) => `${folderPath}\\${filename}.${ext}`);
      setSelectedFiles(filePaths);
      setCurrentDir(folderPath);
    }
  };

  useEffect(() => {
    folders.forEach(async (f) => {
      const { folderPath, expand, id } = f;
      if (expand) {
        const entries = await readDir(folderPath);
        // 把文件名相同但后缀不同的文件放在一起
        const files = entries
          .filter((i) => i.isFile)
          .reduce((acc, entry) => {
            const { name } = entry;
            const [filename, ext] = name.split(".");
            const value = acc.get(filename) || [];
            value.push(ext);
            acc.set(filename, value);
            return acc;
          }, new Map<string, string[]>());
        // 对files的值进行深比较，避免触发不必要的更新
        const needRerender = !isEqual(files, filesRef.current.get(id));
        filesRef.current.set(id, files);
        console.log(needRerender);
        needRerender && forceUpdate();
      }
    });
  }, [folders]);

  const handleOpenFolder = (id: string) => {
    updateFolder(id);
  };

  return (
    <List sx={{ width: 250 }}>
      {/* First collapsible item */}
      {folders.map((folder) => {
        const { id, folderPath, expand } = folder;
        const folderName = folderPath.split("\\").pop();
        const files = filesRef.current.get(id);
        return (
          <Fragment key={id}>
            <ListItemButton onClick={() => handleOpenFolder(id)}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={folderName} />
              {expand ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expand} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {files &&
                  [...files.entries()].map(([filename, exts]) => {
                    if (!exts.includes("md")) return null;
                    return (
                      <ListItemButton
                        sx={{ pl: 4 }}
                        key={filename}
                        onClick={() => handleSelectFile(id, filename, exts)}
                      >
                        <ListItemText primary={filename} />
                      </ListItemButton>
                    );
                  })}
              </List>
            </Collapse>
          </Fragment>
        );
      })}
    </List>
  );
};

export default FolderList;
