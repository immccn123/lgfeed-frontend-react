import { useNavigate } from "@remix-run/react";
import { useState, FC } from "react";
import { Button, Input, Form } from "semantic-ui-react";

interface AtToolProps {
  navigate: (to: string) => void;
  username?: string;
}

const AtTool: FC<AtToolProps> = ({ navigate, username: _username }) => {
  const [username, setUsername] = useState(_username);
  return (
    <div>
      <h1>被 @ 查询（24 h）</h1>
      <Form onSubmit={() => navigate(`/tools/at/${username}`)}>
        <Input
          action={
            <Button disabled={!username} type="submit">
              Go
            </Button>
          }
          onChange={(_, { value }) => setUsername(value)}
          value={username}
          placeholder="用户名"
        />
      </Form>
    </div>
  );
};

export default function AtToolWrapper() {
  const navigate = useNavigate();
  return <AtTool navigate={navigate} />;
}
