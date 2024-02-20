import React, { useEffect, useState } from "react";
import {
  Button,
  Feed,
  Input,
  List,
  Message,
  Pagination,
  Segment,
} from "semantic-ui-react";
import { useNavigate } from "@remix-run/react";
import { api } from "~/utils/api";
import { UserFeeds } from "~/interfaces";
import { Benben, createUidFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import useSWR from "swr";

interface UserDefaultProps {
  navigate: (to: string) => void;
}

const NameList: React.FC<{ data: string[] }> = ({ data }) => {
  return (
    <List bulleted>
      {data.map((value) => (
        <List.Item>{value}</List.Item>
      ))}
    </List>
  );
};

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

  return (
    <UserDefault
      navigate={navigate}
    />
  );
}
