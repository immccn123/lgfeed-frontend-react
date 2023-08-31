import React, { Component } from "react";
import {
  Button,
  Feed,
  Input,
  List,
  Message,
  Pagination,
  Segment,
  Transition,
} from "semantic-ui-react";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { CachedResponse, UserFeeds, UserFeedsResponse } from "~/interfaces";
import { AxiosResponse } from "axios";
import { SingleFeed, createUidFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";

interface UserInfoState {
  uid?: number | string;
  confirmUid?: number | string;
  page: number;
  userFeeds?: UserFeeds;
  historyUsernames?: string[];
}

interface UserDefaultProps {
  navigate: (to: string) => void;
  uid?: number | string;
}

const NameList: React.FC<{ data: string[] }> = ({ data }) => {
  if (data.length == 0) {
    return (
      <Message>
        <Message.Header>唔……？</Message.Header>
        <Message.Content>
          没有找到 Ta 的数据呢，似乎是因为 Ta 没有发过犇犇？
        </Message.Content>
      </Message>
    );
  }
  return (
    <List bulleted>
      {data.map((value) => (
        <List.Item>{value}</List.Item>
      ))}
    </List>
  );
};

class UserDefault extends Component<UserDefaultProps, UserInfoState> {
  constructor(props: UserDefaultProps) {
    super(props);
    this.state = {
      uid: props.uid,
      confirmUid: props.uid,
      page: 1,
    };
    this.goToUserPage = this.goToUserPage.bind(this);
  }

  goToUserPage() {
    this.props.navigate(`/user/${this.state.uid}`);
  }

  getUserFeed() {
    this.setState(
      {
        userFeeds: undefined,
      },
      () => {
        api
          .get<UserFeedsResponse>(
            `/blackHistory/feed/${this.state.uid}?page=${this.state.page}`,
          )
          .then((response: AxiosResponse<UserFeedsResponse>) => {
            this.setState({
              userFeeds: response.data.content,
            });
          });
      },
    );
  }

  getHistoryUsernames() {
    this.setState({ historyUsernames: undefined }, () => {
      api
        .get<CachedResponse<string[]>>(
          `/blackHistory/usernames/${this.state.uid}`,
        )
        .then((response: AxiosResponse<CachedResponse<string[]>>) => {
          this.setState({
            historyUsernames: response.data.content,
          });
        });
    });
  }

  componentDidMount() {
    this.getUserFeed();
    this.getHistoryUsernames();
  }

  buildFeedList() {
    if (!this.state.userFeeds) return <></>;
    return this.state.userFeeds.feeds.length > 0 ? (
      this.state.userFeeds.feeds.map((value) => {
        const { confirmUid } = this.state;
        return (
          <SingleFeed data={createUidFeed(value, confirmUid || 0)}></SingleFeed>
        );
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
        <h1>用户历史查询</h1>
        <Input
          action={
            <Button
              disabled={this.state.uid == null}
              onClick={() => {
                this.setState({ confirmUid: this.state.uid }, () => {
                  this.goToUserPage();
                  this.getUserFeed();
                  this.getHistoryUsernames();
                });
              }}
              loading={this.state.userFeeds === undefined}
            >
              Go
            </Button>
          }
          onChange={(_, { value }) => {
            this.setState({ uid: parseInt(value) });
          }}
          value={this.state.uid}
          placeholder="UID..."
          type="number"
          min={1}
          max={10000000}
        />
        <Transition
          visible={this.state.historyUsernames !== undefined}
          animation="fade down"
        >
          {this.state.historyUsernames ? (
            <Segment>
              <h2>曾用名</h2>
              <NameList data={this.state.historyUsernames} />
            </Segment>
          ) : (
            <></>
          )}
        </Transition>
        <Segment>
          <h2>用户历史</h2>
          <Pagination
            boundaryRange={0}
            activePage={this.state.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={3}
            totalPages={1024}
            onPageChange={(_, { activePage }) => {
              this.setState(
                {
                  page: parseInt(activePage?.toString() || "0"),
                  userFeeds: undefined,
                },
                this.getUserFeed,
              );
            }}
          />
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

export default function UserDefaultWrapper() {
  const navigate = useNavigate(),
    { uid } = useParams();
  return <UserDefault navigate={navigate} uid={uid} />;
}
