import React, { Component, useEffect, useState } from "react";
import {
  Button,
  Feed,
  Input,
  List,
  Message,
  Pagination,
  Segment,
} from "semantic-ui-react";
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { UserFeeds } from "~/interfaces";
import { Benben, createUidFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";

interface UserInfoState {
  uid?: number | string;
  confirmUid?: number | string;
  page: number;
  userFeeds?: UserFeeds;
  historyUsernames?: string[];
}

interface UserDefaultProps {
  navigate: (to: string) => void;
  uid?: number | string;
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
  const [uid, setUid] = useState(props.uid);
  const [confirmUid, setConfirmUid] = useState(props.uid);
  const [page, setPage] = useState(1);
  const [userFeeds, setUserFeeds] = useState<UserFeeds | undefined>(undefined);
  const [historyUsernames, setHistoryUsernames] = useState<string[] | undefined>(undefined);

  const goToUserPage = () => {
    props.navigate(`/user/${uid}`);
  };

  const getUserFeed = () => {
    setUserFeeds(undefined);
    api.get(`/blackHistory/feed/${uid}?page=${page}`).then((response) => {
      setUserFeeds(response.data.content);
    });
  };

  const getHistoryUsernames = () => {
    setHistoryUsernames(undefined);
    api.get(`/blackHistory/usernames/${uid}`).then((response) => {
      setHistoryUsernames(response.data.content);
    });
  };

  useEffect(() => {
    getUserFeed();
    getHistoryUsernames();
  }, [confirmUid]);

  const buildFeedList = () => {
    if (!userFeeds) return <></>;
    return userFeeds.feeds.length > 0 ? (
      userFeeds.feeds.map((value) => (
        <Benben key={value.id} data={createUidFeed(value, confirmUid || 0)} />
      ))
    ) : (
      <Message>
        <Message.Header>唔……？</Message.Header>
        <Message.Content>没有找到 Ta 的数据呢</Message.Content>
      </Message>
    );
  };

  const handleSearch = () => {
    setConfirmUid(uid);
    goToUserPage();
    getUserFeed();
    getHistoryUsernames();
  };

  return (
    <div>
      <h1>用户历史查询</h1>
      <Input
        action={
          <Button
            disabled={uid === null}
            onClick={handleSearch}
            loading={userFeeds === undefined}
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
        disabled={userFeeds === undefined}
      />

      {historyUsernames !== undefined && historyUsernames.length > 0 ? (
        <Segment>
          <h2>曾用名</h2>
          <NameList data={historyUsernames} />
        </Segment>
      ) : null}

      {userFeeds ? (
        <Segment>
          <h2>用户历史</h2>
          <Pagination
            boundaryRange={0}
            activePage={page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={3}
            totalPages={1024}
            onPageChange={(_, { activePage }) =>
              setPage(parseInt(activePage?.toString() || "0"))
            }
          />
          <Feed>{buildFeedList()}</Feed>
        </Segment>
      ) : (
        <Segment>
          <SegmentLoader />
        </Segment>
      )}
    </div>
  );
};

export default function UserDefaultWrapper() {
  const navigate = useNavigate(),
    { uid } = useParams();
  return <UserDefault navigate={navigate} uid={uid} key={uid} />;
}
