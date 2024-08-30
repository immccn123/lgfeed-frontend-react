import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import {
  Button,
  Feed,
  Input,
  List,
  Message,
  Pagination,
  Segment,

  PlaceholderParagraph,
  PlaceholderLine,
  PlaceholderHeader,
  Placeholder,
  Form} from "semantic-ui-react";
import useSWR from "swr";
import { ZodError, z } from "zod";

import { Benben } from "~/components/feed";
import { UserFeeds } from "~/interfaces";
import { fetcher } from "~/utils/api";

interface UserDefaultProps {
  navigate: (to: string) => void;
  uid: number;
  page: number;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const checker = z.object({
    uid: z.coerce
      .number({ invalid_type_error: "UID 的类型必须为 number" })
      .min(1, { message: "UID 必须大于或等于 1" }),
    page: z.coerce
      .number({ invalid_type_error: "页码的类型必须为 number" })
      .min(1, { message: "页码必须大于或等于 1" }),
  });

  try {
    return checker.parse(params);
  } catch (e) {
    throw new Response(
      (e as ZodError).issues.map((x) => x.message).join("\n"),
      { status: 400 },
    );
  }
}

const NameList: React.FC<{ data: string[] }> = ({ data }) => {
  return data.map((value, idx) => (
    <span key={value}>
      <pre
        style={{
          display: "inline-block",
          background: "#cfcfcf",
          padding: "3px",
          borderRadius: "3px",
        }}
      >
        {value}
      </pre>
      {idx !== data.length - 1 ? " · " : null}
    </span>
  ));
};

const Paginator: React.FC<{
  goToPage: (page?: number | string) => void;
  totalPages: number;
  disabled?: boolean;
  activePage: number;
}> = ({ goToPage, totalPages, disabled: isDisabled, activePage }) => {
  const [page, setPage] = useState<number>(activePage);
  const pageInput = (
    <Input
      action={
        <Button disabled={isDisabled} onClick={() => goToPage(page)}>
          Go
        </Button>
      }
      onChange={(_, { value }) => setPage(parseInt(value))}
      value={page}
      placeholder="Page"
      type="number"
      min={1}
      max={10000000}
      disabled={isDisabled}
    />
  );

  return (
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
          activePage={activePage}
          ellipsisItem={null}
          siblingRange={2}
          totalPages={totalPages}
          onPageChange={(_, { activePage }) => goToPage(activePage)}
          disabled={isDisabled}
        />
        <div style={{ padding: 10, display: "inline-block" }}>{pageInput}</div>
      </Segment>
    </div>
  );
};

const UserDefault = ({ navigate, uid, page }: UserDefaultProps) => {
  const perPage = 50;
  const [inputUid, setInputUid] = useState(uid);

  const { data: historyUsernames } = useSWR<string[]>(
    `/blackHistory/usernames/${uid}`,
    fetcher,
  );

  const { data: userFeed, isLoading } = useSWR<UserFeeds>(
    `/blackHistory/feed/${uid}?page=${page}&per_page=${perPage}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const handleSearch = () => navigate(`/user/${inputUid}/1`);
  const goToPage = (page?: number | string) =>
    navigate(`/user/${uid}/${page ?? 1}`);

  const UidInput = (
    <Form onSubmit={handleSearch}>
      <Input
        action={
          <Button
            disabled={inputUid === null || isLoading}
            loading={isLoading}
            type="submit"
          >
            Go
          </Button>
        }
        onChange={(_, { value }) => setInputUid(parseInt(value))}
        value={inputUid}
        placeholder="UID..."
        type="number"
        min={1}
        max={10000000}
        disabled={!userFeed}
      />
    </Form>
  );

  return (
    <div>
      <h1>用户历史查询</h1>
      {UidInput}

      <List>
        <List.Item>
          {historyUsernames && historyUsernames.length > 0 ? (
            <>
              曾用名：
              <NameList data={historyUsernames} />
            </>
          ) : (
            <Placeholder>
              <PlaceholderParagraph>
                <PlaceholderLine />
              </PlaceholderParagraph>
            </Placeholder>
          )}
        </List.Item>
        {userFeed && userFeed.feeds.length > 0 ? (
          <List.Item>累计犇犇发送数量：{userFeed.count}</List.Item>
        ) : (
          <Placeholder>
            <PlaceholderParagraph>
              <PlaceholderLine />
            </PlaceholderParagraph>
          </Placeholder>
        )}
      </List>

      <h2>历史犇犇</h2>
      {userFeed && userFeed.feeds.length > 0 ? (
        <>
          <Feed>
            {userFeed.feeds.map((value, index) => (
              <Benben key={value.id} data={value} adNext={index !== 0 && index % 15 === 0} />
            ))}
          </Feed>
        </>
      ) : userFeed ? (
        <Message>
          <Message.Header>唔……？</Message.Header>
          <Message.Content>没有找到 Ta 的数据呢</Message.Content>
        </Message>
      ) : (
        <>
          <Placeholder fluid>
            <PlaceholderHeader image>
              <PlaceholderLine />
              <PlaceholderLine />
            </PlaceholderHeader>
            <PlaceholderParagraph>
              <PlaceholderLine />
              <PlaceholderLine />
            </PlaceholderParagraph>
          </Placeholder>
          <div style={{ height: 30 }}></div>
        </>
      )}

      <Paginator
        goToPage={goToPage}
        totalPages={userFeed ? Math.ceil(userFeed.count / perPage) : 1}
        disabled={!(userFeed && userFeed.feeds.length > 0)}
        activePage={page}
      />
    </div>
  );
};

export default function UserDefaultWrapper() {
  const navigate = useNavigate(),
    { uid, page } = useLoaderData<typeof loader>();

  return (
    <UserDefault
      navigate={navigate}
      uid={uid}
      page={page}
      key={uid.toString() + "/" + page.toString()}
    />
  );
}
