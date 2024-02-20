import { useEffect, useState } from "react";
import { Button, Feed, Input, Message, Segment } from "semantic-ui-react";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { CachedResponse, BenbenItem } from "~/interfaces";
import { Benben } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";

interface AtResponse extends CachedResponse<BenbenItem[]> {}

interface AtToolProps {
  navigate: (to: string) => void;
  username?: string;
}

const AtTool: React.FC<AtToolProps> = ({ username: _username, navigate }) => {
  const [username, setUsername] = useState<string | undefined>(_username);
  const [userFeeds, setUserFeeds] = useState<BenbenItem[] | undefined>();

  const goToUserPage = () => {
    navigate(`/tools/at/${username}`);
  };

  const getUserFeed = () => {
    setUserFeeds(undefined);

    api.get<AtResponse>(`/tools/at/${username}`).then((response) => {
      setUserFeeds(response.data.content);
    });
  };

  useEffect(() => {
    getUserFeed();
  }, []);

  const FeedList: React.FC<{}> = () => {
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

  const handleSearch = () => {
    goToUserPage();
  };

  return (
    <div>
      <h1>谁在拍我铃铛？（近 24 小时）</h1>
      <Input
        action={
          <Button
            disabled={!username}
            loading={!userFeeds}
            onClick={handleSearch}
          >
            Go
          </Button>
        }
        onChange={(_, { value }) => setUsername(value)}
        value={username}
        placeholder="用户名"
      />
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
