import { Message, Icon } from "semantic-ui-react";

export const Announcement = () => {
  return (
    <Message warning>
      <Icon name="info circle" />
      不鼓励任何形式的刷榜行为。
    </Message>
  );
};
