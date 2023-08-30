import { Component } from "react";
import { Button, Input, Segment } from "semantic-ui-react";

interface UserInfoState {
  uid: number;
}

export default class UserInfo extends Component<{}, UserInfoState> {
  constructor(props: {}) {
    super(props);
    this.state = { uid: props.uid }
  }

  render() {
    return (
      <div>
        <h1>用户历史查询</h1>
        <Segment>
          <Input
            action={
              <Button disabled={this.state.uid == null}>Go</Button>
            }
            onChange={(_, { value }) => { this.setState({ uid: parseInt(value) }) }}
            placeholder='UID...' type="number" min={0} max={10000000} value={this.state.uid} />
          <p>咕咕咕</p>
        </Segment>
      </div>
    )
  }
}