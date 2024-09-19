import { Message } from "semantic-ui-react";

export const Announcement = () => {
  return (
    <Message
      color="red"
      style={{
        border: "none",
        boxShadow: "none",
        borderRadius: "0",
        margin: "0",
      }}
    >
      意见或问题反馈请加 QQ 群：313404608 | 支持我们继续做下去！
      <a href="https://sponsor.imken.moe">捐赠（请备注为犇站）</a>
    </Message>
  );
};
