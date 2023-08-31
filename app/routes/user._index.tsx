import { Component } from "react";
import { Button, Input, Segment } from "semantic-ui-react";
import { useNavigate } from "@remix-run/react";

interface UserDeafultState {
  uid?: number;
}

interface UserDefaultProps {
  navigate: (to: string) => void;
}

class UserDefault extends Component<UserDefaultProps, UserDeafultState> {
  constructor(props: UserDefaultProps) {
    super(props);
    this.state = { uid: undefined }
    this.goToUserPage = this.goToUserPage.bind(this);
  }

  goToUserPage() {
    this.props.navigate(`/user/${this.state.uid}`);
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
            placeholder='UID...' type="number" min={1} max={10000000} />
        </Segment>
      </div>
    )
  }
}

export default function UserDefaultWrapper() {
  const navigate = useNavigate();
  return <UserDefault navigate={navigate} />;
}