import { Component } from "react";
import { Button, Feed, Input, Loader, Segment } from "semantic-ui-react";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { UserFeeds, UserFeedsResponse } from "~/interfaces";
import { AxiosResponse } from "axios";
import { SingleFeed, createUidFeed } from "~/components/feed";

interface UserInfoState {
  uid?: number | string;
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
      page: 1,
    }
    this.goToUserPage = this.goToUserPage.bind(this);
  }

  goToUserPage() {
    this.props.navigate(`/user/${this.state.uid}`);
  }

  getUserFeed() {
    api.get<UserFeedsResponse>(`/blackHistory/feed/${this.state.uid}`)
      .then((response: AxiosResponse<UserFeedsResponse>) => {
        this.setState({
          userFeeds: response.data.content,
        });
      })
  }
  
  componentDidMount() {
    this.getUserFeed();
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
                onClick={this.goToUserPage}
              >Go</Button>
            }
            onChange={(_, { value }) => { this.setState({ uid: parseInt(value) }) }}
            value={this.state.uid}
            placeholder='UID...'
            type="number"
            min={0}
            max={10000000}
          />
          {
            this.state.userFeeds ?
              (
                <Feed>
                  {
                    this.state.userFeeds.feeds.map((value) => {
                      return (<SingleFeed data={createUidFeed(value, this.state.uid || 0)}></SingleFeed>);
                    })
                  }
                </Feed>
              ) : (
                <div style={{ height: 100 }}>
                  <Loader active>少女祈祷中……</Loader>
                </div>
              )
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
