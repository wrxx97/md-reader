import { useEffect } from "react";

/**
 * Hook to intercept external links and optionally stop their navigation.
 * @param onExternalLinkClick - Function to handle external link clicks.
 */
const useStopExternalLink = (onExternalLinkClick?: (href: string) => void) => {
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;

      // 检查是否为 a 标签，且 href 存在
      if (target.tagName === "A" && target.href) {
        const isExternal = !target.href.includes(window.location.hostname);

        if (isExternal) {
          e.preventDefault(); // 阻止外部链接跳转
          console.log("External link intercepted:", target.href);

          if (onExternalLinkClick) {
            onExternalLinkClick(target.href); // 调用外部传入的回调函数
          } else {
            // 默认行为：弹出确认框
            // if (window.confirm("You are leaving the site. Continue?")) {
            //   window.location.href = target.href; // 手动跳转
            // }
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [onExternalLinkClick]);
};

export default useStopExternalLink;
