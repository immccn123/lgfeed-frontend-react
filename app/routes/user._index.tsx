import { useState } from "react";
import { Button, Input } from "semantic-ui-react";
import { useNavigate } from "@remix-run/react";

interface UserDefaultProps {
  navigate: (to: string) => void;
}

const UserDefault = (props: UserDefaultProps) => {
  const [uid, setUid] = useState<number | null>();

  return (
    <div>
      <h1>用户历史查询</h1>
      <Input
        action={
          <Button
            disabled={uid === null}
            onClick={() => props.navigate((uid ?? 1).toString())}
          >
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
    </div>
  );
};

export default function UserDefaultWrapper() {
  const navigate = useNavigate();

  return <UserDefault navigate={navigate} />;
}
