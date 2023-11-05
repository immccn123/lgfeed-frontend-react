import { Message } from "semantic-ui-react";

export const Announcement = () => {
  return (
    <Message info>
      若近期在境内访问本站较艰难，您可以使用 aws-benben.imken.dev 备用节点。
      <br />
      <a href="https://support.imken.dev/open.php?topicId=2" target="_blank">问题反馈/功能请求（Imken Support）</a> |
      <a href="https://github.com/immccn123/lgfeed-frontend-react/issues" target="_blank">GitHub Issue</a>
    </Message>
  );
};
