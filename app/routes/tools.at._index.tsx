import { Component } from "react";
import { Button, Input } from "semantic-ui-react";
import { useNavigate } from "@remix-run/react";

interface AtToolState {
  username?: string;
}

interface AtToolProps {
  navigate: (to: string) => void;
  username?: string;
}

class AtTool extends Component<AtToolProps, AtToolState> {
  constructor(props: AtToolProps) {
    super(props);
    this.state = {
      username: props.username,
    };
    this.goToUserPage = this.goToUserPage.bind(this);
  }

  goToUserPage() {
    this.props.navigate(`/tools/at/${this.state.username}`);
  }

  render() {
    return (
      <div>
        <h1>被 @ 查询（24 h）</h1>
        <Input
          action={
            <Button
              disabled={this.state.username == null}
              onClick={() => {
                this.goToUserPage();
              }}
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
      </div>
    );
  }
}

export default function AtToolWrapper() {
  const navigate = useNavigate();
  return <AtTool navigate={navigate} />;
}
