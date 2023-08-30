import { Message } from "semantic-ui-react";

export default function Index() {
  return (
    <div>
      <Message
        negative
        icon="warning circle"
        header="Not Found"
        content="我们找不到这个页面呢~"
      />
    </div>
  );
}
