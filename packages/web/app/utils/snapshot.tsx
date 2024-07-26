import html2canvas from "html2canvas";
import { ReactNode } from "react";
import { createRoot } from "react-dom/client";

export async function takeSnapshot(node: ReactNode) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const iframeDocument = iframe.contentDocument;
  if (iframeDocument === null) throw new Error();
  const container = iframeDocument.createElement("div");
  container.style.width = "400px";
  iframeDocument.body.appendChild(container);

  const root = createRoot(container);
  root.render(node);

  try {
    const result = await html2canvas(container, {
      scrollY: -window.scrollY,
      x: 0,
      y: 0,
      width: 400,
      height: 600,
    });
    return result.toDataURL(); // 返回DataURL
  } finally {
    document.body.removeChild(iframe); // 移除iframe
  }
}
