import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Button, Form, Input } from "semantic-ui-react";

interface UserDefaultProps {
  navigate: (to: string) => void;
}

const UserDefault = (props: UserDefaultProps) => {
  const [uid, setUid] = useState<number | null>();

  return (
    <div>
      <h1>用户历史查询</h1>
      <Form onSubmit={() => props.navigate((uid ?? 1).toString())}>
        <Input
          action={
            <Button disabled={uid === null} type="submit">
              Go
            </Button>
          }
          onChange={(_, { value }) => setUid(parseInt(value))}
          value={uid}
          placeholder="UID..."
          type="number"
          min={1}
          max={10000000}
        />
      </Form>
    </div>
  );
};

export default function UserDefaultWrapper() {
  const navigate = useNavigate();

  return <UserDefault navigate={navigate} />;
}
