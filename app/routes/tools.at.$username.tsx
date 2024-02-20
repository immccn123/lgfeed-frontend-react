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

const AtTool: React.FC<AtToolProps> = (props) => {
  const [username, setUsername] = useState<string | undefined>(props.username);
  const [userFeeds, setUserFeeds] = useState<BenbenItem[] | undefined>();

  const goToUserPage = () => {
    props.navigate(`/tools/at/${username}`);
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

  const buildFeedList = () => {
    if (!userFeeds) return null;
    return userFeeds.length > 0 ? (
      userFeeds.map((value) => <Benben key={value.id} data={value} />)
    ) : (
      <Message>
        <Message.Header>唔……？</Message.Header>
        <Message.Content>没有找到 Ta 的数据呢</Message.Content>
      </Message>
    );
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
            disabled={username === undefined}
            onClick={handleSearch}
            loading={userFeeds === undefined}
          >
            Go
          </Button>
        }
        onChange={(_, { value }) => {
          setUsername(value)
        }}
        value={username}
        placeholder="用户名"
      />
      <>
        {userFeeds ? <Feed>{buildFeedList()}</Feed> : <Segment><SegmentLoader /></Segment>}
      </>
    </div>
  );
};

export default function AtToolWrapper() {
  const navigate = useNavigate(),
    { username } = useParams();
  return <AtTool navigate={navigate} username={username} key={username} />;
}
