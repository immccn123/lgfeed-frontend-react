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
import { useNavigate, useParams } from "@remix-run/react";
import { api } from "~/utils/api";
import { UserFeeds } from "~/interfaces";
import { Benben, createUidFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import useSWR from "swr";

interface UserDefaultProps {
  navigate: (to: string) => void;
  uid: string;
  page: string;
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
  const confirmUid = props.uid;
  const [uid, setUid] = useState(parseInt(props.uid));
  const [userFeeds, setUserFeeds] = useState<UserFeeds>();
  const [pageInput, setPageInput] = useState<number>(parseInt(props.page));

  const { data: historyUsernames } = useSWR(
    `/blackHistory/usernames/${confirmUid}`,
    (url: string) => api.get(url).then((resp) => resp.data.content as string[]),
  );

  useEffect(() => {
    api.get(`/blackHistory/feed/${confirmUid}?page=${props.page}`).then((response) => {
      setUserFeeds(response.data.content);
    });
  }, [confirmUid]);

  const handleSearch = () => {
    props.navigate(`/user/${uid}/1`);
  };

  const goToPage = (page?: number | string) => {
    props.navigate(`/user/${confirmUid}/${page ?? 1}`);
  };

  return (
    <div>
      <h1>用户历史查询</h1>
      <Input
        action={
          <Button
            disabled={uid === null || !userFeeds}
            onClick={handleSearch}
            loading={!userFeeds}
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
        disabled={!userFeeds}
      />

      {historyUsernames && historyUsernames.length > 0 ? (
        <>
          <h2>曾用名</h2>
          <NameList data={historyUsernames} />
        </>
      ) : null}

      {userFeeds && userFeeds.feeds.length > 0 ? (
        <>
          <h2>历史犇犇</h2>
          <Feed>
            {userFeeds.feeds.map((value) => (
              <Benben
                key={value.id}
                data={createUidFeed(value, confirmUid ?? 0)}
              />
            ))}
          </Feed>
        </>
      ) : (
        <>
          {userFeeds ? (
            <Message>
              <Message.Header>唔……？</Message.Header>
              <Message.Content>没有找到 Ta 的数据呢</Message.Content>
            </Message>
          ) : (
            <Segment>
              <SegmentLoader />
            </Segment>
          )}
        </>
      )}

      <div
        style={{
          position: "sticky",
          bottom: "12px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <Segment>
          <Pagination
            boundaryRange={0}
            activePage={props.page}
            ellipsisItem={null}
            siblingRange={3}
            totalPages={1024}
            onPageChange={(_, { activePage }) => goToPage(activePage)}
            disabled={userFeeds === undefined}
          />
          <div style={{ padding: 10, display: "inline-block" }}>
            <Input
              action={
                <Button
                  disabled={userFeeds === undefined}
                  onClick={() => goToPage(pageInput)}
                >
                  Go
                </Button>
              }
              onChange={(_, { value }) => setPageInput(parseInt(value))}
              value={pageInput}
              placeholder="Page"
              type="number"
              min={1}
              max={10000000}
              disabled={userFeeds === undefined}
            />
          </div>
        </Segment>
      </div>
    </div>
  );
};

export default function UserDefaultWrapper() {
  const navigate = useNavigate(),
    { uid, page } = useParams();

  return (
    <UserDefault
      navigate={navigate}
      uid={uid!}
      page={page!}
      key={uid!.toString() + page!.toString()}
    />
  );
}
