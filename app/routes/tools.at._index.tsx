import React, { Component, useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { useNavigate } from "@remix-run/react";

interface AtToolProps {
  navigate: (to: string) => void;
  username?: string;
}

const AtTool: React.FC<AtToolProps> = ({ navigate, username: _username }) => {
  const [username, setUsername] = useState(_username);
  return (
    <div>
      <h1>被 @ 查询（24 h）</h1>
      <Input
        action={
          <Button
            disabled={!username}
            onClick={() => navigate(`/tools/at/${username}`)}
          >
            Go
          </Button>
        }
        onChange={(_, { value }) => setUsername(value)}
        value={username}
        placeholder="用户名"
      />
    </div>
  );
};

export default function AtToolWrapper() {
  const navigate = useNavigate();
  return <AtTool navigate={navigate} />;
}
