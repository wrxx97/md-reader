import { create } from "zustand";
import { v7 as uuidv7 } from "uuid";
import { persist } from "zustand/middleware";

interface Folder {
  id: string;
  folderPath: string;
  expand: boolean;
}

// 定义文件存储的状态和方法
interface FileStore {
  currentDir: string;
  setCurrentDir: (dir: string) => void;
  selectedFiles: string[];
  setSelectedFiles: (filePaths: string[]) => void;
  clearFile: () => void;
  // 选择文件夹
  selectedFolder: string | null;
  setSelectedFolder: (folderPath: string) => void;
  clearFolder: () => void;
  // 保存一个文件夹路径的数组
  folders: Folder[];
  addFolder: (path: string) => void;
  removeFolder: (id: string) => void;
  clearFolders: () => void;
  updateFolder: (id: string) => void;
}

// 使用 persist 中间件持久化状态
export const useFileStore = create<FileStore>()(
  persist(
    (set) => ({
      currentDir: "",
      setCurrentDir: (dir) => set({ currentDir: dir }),
      selectedFiles: [],
      setSelectedFiles: (filePaths) => set({ selectedFiles: filePaths }),
      clearFile: () => set({ selectedFiles: [] }),
      selectedFolder: null,
      setSelectedFolder: (folderPath) => set({ selectedFolder: folderPath }),
      clearFolder: () => set({ selectedFolder: null }),
      folders: [],
      addFolder: (folderPath) => {
        const id = uuidv7();
        const newFolder = {
          id,
          folderPath,
          expand: false,
        };
        set((state) => ({
          folders: [newFolder, ...state.folders],
        }));
      },
      updateFolder: (id) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, expand: !folder.expand } : folder
          ),
        }));
      },
      removeFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
        })),
      clearFolders: () => set({ folders: [] }),
    }),
    {
      name: "file-store", // localStorage 中的 key
    }
  )
);
