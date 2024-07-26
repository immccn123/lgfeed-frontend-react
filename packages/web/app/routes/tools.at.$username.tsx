import { useNavigate, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Button, Feed, Input, Message, Segment, Form } from "semantic-ui-react";

import { Benben } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import { BenbenItem } from "~/interfaces";
import { api } from "~/utils/api";

type AtResponse = BenbenItem[];

interface AtToolProps {
  navigate: (to: string) => void;
  username?: string;
}

const AtTool = ({ username: _username, navigate }: AtToolProps) => {
  const [username, setUsername] = useState<string | undefined>(_username);
  const [userFeeds, setUserFeeds] = useState<BenbenItem[] | undefined>();

  const getUserFeed = () => {
    setUserFeeds(undefined);

    api
      .get<AtResponse>(`/tools/at/${username}`)
      .then(({ data }) => setUserFeeds(data));
  };

  useEffect(getUserFeed, [username]);

  const FeedList: React.FC = () => {
    if (!userFeeds) return null;
    if (userFeeds.length <= 0)
      return (
        <Message>
          <Message.Header>唔……？</Message.Header>
          <Message.Content>没有找到 Ta 的数据呢</Message.Content>
        </Message>
      );
    return userFeeds.map((value) => <Benben key={value.id} data={value} />);
  };

  return (
    <div>
      <h1>谁在拍我铃铛？（近 24 小时）</h1>
      <Form onSubmit={() => navigate(`/tools/at/${username}`)}>
        <Input
          action={
            <Button disabled={!username} loading={!userFeeds} type="submit">
              Go
            </Button>
          }
          onChange={(_, { value }) => setUsername(value)}
          value={username}
          placeholder="用户名"
        />
      </Form>
      <>
        {userFeeds ? (
          <Feed>
            <FeedList />
          </Feed>
        ) : (
          <Segment>
            <SegmentLoader />
          </Segment>
        )}
      </>
    </div>
  );
};

export default function AtToolWrapper() {
  const navigate = useNavigate(),
    { username } = useParams();
  return <AtTool navigate={navigate} username={username} key={username} />;
}
