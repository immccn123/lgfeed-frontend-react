import { Component } from "react";
import { Button, Feed, Input, Message, Segment } from "semantic-ui-react";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { CachedResponse, SingleFeedItem } from "~/interfaces";
import { AxiosResponse } from "axios";
import { SingleFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";

interface AtToolState {
  username?: string;
  confirmUsername?: string;
  userFeeds?: SingleFeedItem[];
}

interface AtResponse extends CachedResponse<SingleFeedItem[]> {}

interface AtToolProps {
  navigate: (to: string) => void;
  username?: string;
}

class AtTool extends Component<AtToolProps, AtToolState> {
  constructor(props: AtToolProps) {
    super(props);
    this.state = {
      username: props.username,
      confirmUsername: props.username,
    };
    this.goToUserPage = this.goToUserPage.bind(this);
  }

  goToUserPage() {
    this.props.navigate(`/tools/at/${this.state.username}`);
  }

  getUserFeed() {
    this.setState(
      {
        userFeeds: undefined,
      },
      () => {
        api
          .get<AtResponse>(`/tools/at/${this.state.username}`)
          .then((response: AxiosResponse<AtResponse>) => {
            this.setState({
              userFeeds: response.data.content,
            });
          });
      },
    );
  }

  componentDidMount() {
    this.getUserFeed();
  }

  buildFeedList() {
    if (!this.state.userFeeds) return <></>;
    return this.state.userFeeds.length > 0 ? (
      this.state.userFeeds.map((value) => {
        return <SingleFeed data={value}></SingleFeed>;
      })
    ) : (
      <Message>
        <Message.Header>唔……？</Message.Header>
        <Message.Content>没有找到 Ta 的数据呢</Message.Content>
      </Message>
    );
  }

  render() {
    return (
      <div>
        <h1>谁在拍我铃铛？（近 24 小时）</h1>
        <Input
          action={
            <Button
              disabled={this.state.username == null}
              onClick={() => {
                this.setState({ confirmUsername: this.state.username }, () => {
                  this.goToUserPage();
                  this.getUserFeed();
                });
              }}
              loading={this.state.userFeeds === undefined}
            >
              Go
            </Button>
          }
          onChange={(_, { value }) => {
            this.setState({ username: value });
          }}
          value={this.state.username}
          placeholder="用户名"
        />
        <Segment>
          {this.state.userFeeds ? (
            <Feed>{this.buildFeedList()}</Feed>
          ) : (
            <SegmentLoader />
          )}
        </Segment>
      </div>
    );
  }
}

export default function AtToolWrapper() {
  const navigate = useNavigate(),
    { username } = useParams();
  return <AtTool navigate={navigate} username={username} />;
}
