import { Component } from "react";
import { Button, Input, Segment } from "semantic-ui-react";

interface FeedInfoState {
  uid: number;
}

export default class FeedInfo extends Component<{}, FeedInfoState> {
  render() {
    return (
      <div>
        <h1>历史单条犇犇</h1>
        <Segment>
          <h2>咕咕咕</h2>
        </Segment>
      </div>
    )
  }
}