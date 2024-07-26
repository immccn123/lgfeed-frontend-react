import { createRoot } from "react-dom/client";
import { Message } from "semantic-ui-react";

const showNotification = (
  message: string,
  messageType?: "error" | "warning" | "success",
) => {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container)

  root.render(
    <Message
      error={messageType === "error"}
      warning={messageType === "warning"}
      success={messageType === "success"}
      style={{ position: "fixed", zIndex: 1500, top: 10, left: 10 }}
    >
      {message}
    </Message>,
  );

  setTimeout(() => {
    document.body.removeChild(container);
  }, 5000);
};

export default showNotification;
