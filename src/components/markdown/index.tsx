import { useFileStore } from "@/store/FileStore";
import { readFile } from "@tauri-apps/plugin-fs";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownViewerProps {
  text: string;
}

const defaultText = `# Hello, Markdown!`;

const IMGS = new Map();

const updateImgSrc = async (currentDir: string, src: string) => {
  const path = `${currentDir}/${src}`;
  if (IMGS.has(src)) {
    return IMGS.get(src);
  }
  const buffer = await readFile(path);
  const blob = new Blob([buffer], { type: "image/jpg" });
  const url = URL.createObjectURL(blob);
  IMGS.set(src, url);
  document.querySelectorAll(`img[data-src="${src}"]`).forEach((img) => {
    img.setAttribute("src", url);
  });
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ text }) => {
  const currentDir = useFileStore((state) => state.currentDir);

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <ReactMarkdown
        children={text || defaultText}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                // @ts-ignore
                style={a11yDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img({ src, alt }) {
            if (src) {
              updateImgSrc(currentDir, src);
            }
            return (
              <img
                src={IMGS.get(src)}
                data-src={src}
                alt={alt}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "1000px",
                }}
              />
            );
          },
        }}
      />
    </div>
  );
};

export default MarkdownViewer;
