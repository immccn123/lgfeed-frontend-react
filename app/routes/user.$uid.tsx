import { Component } from "react";
import { Button, Feed, Input, Message, Segment } from "semantic-ui-react";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { UserFeeds, UserFeedsResponse } from "~/interfaces";
import { AxiosResponse } from "axios";
import { SingleFeed, createUidFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";

interface UserInfoState {
  uid?: number | string;
  confirmUid?: number | string;
  page: number;
  userFeeds?: UserFeeds;
}

interface UserDefaultProps {
  navigate: (to: string) => void;
  uid?: number | string;
}

class UserDefault extends Component<UserDefaultProps, UserInfoState> {
  constructor(props: UserDefaultProps) {
    super(props);
    this.state = {
      uid: props.uid,
      confirmUid: props.uid,
      page: 1,
    }
    this.goToUserPage = this.goToUserPage.bind(this);
  }

  goToUserPage() {
    this.props.navigate(`/user/${this.state.uid}`);
  }

  getUserFeed() {
    this.setState({
      userFeeds: undefined,
    }, () => {
      api.get<UserFeedsResponse>(`/blackHistory/feed/${this.state.uid}?page=${this.state.page}`)
        .then((response: AxiosResponse<UserFeedsResponse>) => {
          this.setState({
            userFeeds: response.data.content,
          });
        })
    });
  }

  componentDidMount() {
    this.getUserFeed();
  }

  buildFeedList() {
    if (!this.state.userFeeds) return (<></>);
    return this.state.userFeeds.feeds.length > 0 ? this.state.userFeeds.feeds.map((value) => {
      const { confirmUid } = this.state;
      return (<SingleFeed data={createUidFeed(value, confirmUid || 0)}></SingleFeed>);
    }) : (
      <Message>
        <Message.Header>唔……？</Message.Header>
        <Message.Content>没有找到 Ta 的数据呢</Message.Content>
      </Message>
    );
  }

  render() {
    return (
      <div>
        <h1>用户历史查询</h1>
        <Segment>
          <Input
            action={
              <Button
                disabled={this.state.uid == null}
                onClick={() => {
                  this.setState({ confirmUid: this.state.uid }, () => {
                    this.goToUserPage();
                    this.getUserFeed();
                  })
                }}
                loading={this.state.userFeeds === undefined}
              >Go</Button>
            }
            onChange={(_, { value }) => { this.setState({ uid: parseInt(value) }); }}
            value={this.state.uid}
            placeholder='UID...'
            type="number"
            min={1}
            max={10000000}
          />
          {
            this.state.userFeeds ?
              (<Feed>{this.buildFeedList()}</Feed>) : (<SegmentLoader />)
          }
        </Segment>
      </div>
    )
  }
}

export default function UserDefaultWrapper() {
  const navigate = useNavigate(), { uid } = useParams();
  return <UserDefault navigate={navigate} uid={uid} />;
}
