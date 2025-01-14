import "./App.css";
import Header from "@/components/header";
import Markdown from "@/components/markdown";
import Audio from "@/components/audio";
import { useEffect, useState } from "react";
import { readFile } from "@tauri-apps/plugin-fs";
import { useFileStore } from "./store/FileStore";
import { getFileExt } from "./utils";
import Box from "@mui/material/Box";
import useStopExternalLink from "./hooks/useStopExternalLink";

function App() {
  const [text, setText] = useState<string>("# Hello, Markdown!");
  const [audio, setAudio] = useState<string>("");
  useStopExternalLink();

  const selectedFiles = useFileStore((state) => state.selectedFiles);

  useEffect(() => {
    if (selectedFiles.length) {
      (async function () {
        selectedFiles.forEach(async (filePath) => {
          const ext = getFileExt(filePath);
          const buffer = await readFile(filePath);
          switch (ext) {
            case "mp3":
              // 讲mp3转换为src
              const blob = new Blob([buffer], { type: "audio/mpeg" });
              const url = URL.createObjectURL(blob);
              setAudio(url);
              break;
            case "md":
              const text = new TextDecoder().decode(buffer);
              setText(text);
              break;
            default:
              console.log("Unsupported file type");
          }
        });
      })();
    }
  }, [selectedFiles]);

  return (
    <main className="container">
      <Header />
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "scroll",
          borderRadius: 0,
          backgroundColor: "background.paper",
        }}
      >
        <Audio src={audio} />
        <Markdown text={text} />
      </Box>
    </main>
  );
}

export default App;
