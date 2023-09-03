import { ActionArgs, LoaderArgs, Response, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import Turnstile from "react-turnstile";
import { Button, Feed, Form, Icon, Message, Segment } from "semantic-ui-react";
import { SingleFeed } from "~/components/feed";
import { CachedResponse, SingleFeedItem, SingleFeedItemResponse } from "~/interfaces";
import { createCollection, getCollection } from "~/models/collection.server";
import { validateTurnstileToken } from "~/turnstile.server";
import { api } from "~/utils/api";
import { randomString } from "~/utils/rand";

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  let feeds: number[] = [];
  if (from) {
    const collection = await getCollection(from);
    if (collection === null) {
      throw new Response("Collection Not Found", { status: 404 });
    }
    feeds = collection.feeds;
  }
  return {
    SITEKEY: process.env.TURNSTILE_SITEKEY,
    feeds,
    feedLabel: from,
  };
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const token = formData.get("cf-turnstile-response")?.toString();
  const feeds = formData
    .get("feeds")
    ?.toString()
    .split(",")
    .map((value) => parseInt(value));
  if (!feeds) throw new Response("Bad request", { status: 400 });
  if (await validateTurnstileToken(token?.toString() || "")) {
    const collection = await createCollection(feeds, randomString(9));
    return redirect(`/collection/${collection.label}`);
  } else {
    throw new Response("Invalid CAPTCHA", { status: 400 });
  }
}

export default function CreateCollectionPage() {
  const [feeds, setFeeds] = useState<number[]>([]);
  const [feedContent, setFeedContent] = useState<SingleFeedItem[]>([]);
  const [feed, setFeed] = useState<string>("");
  const [token, setToken] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const { SITEKEY, feeds: loaderFeed, feedLabel } = useLoaderData();

  const addFeed = async () => {
    try {
      setLoading(true);
      const feedResponse = await api.get<SingleFeedItemResponse>(
        `/tools/getFeed/${feed}`,
      );
      setFeeds([...feeds, feedResponse.data.content.id]);
      setFeedContent([...feedContent, feedResponse.data.content]);
    } catch {
    } finally {
      setLoading(false);
      setFeed("");
    }
  };

  const removeFeed = (feedIndex: number) => {
    setFeeds(feeds.filter((_, index) => index !== feedIndex));
    setFeedContent(feedContent.filter((_, index) => index !== feedIndex));
    console.log("removed", feedIndex);
  };

  const swapFeed = (indexL: number, indexR: number) => {
    let newFeeds = [...feeds];
    [newFeeds[indexL], newFeeds[indexR]] = [newFeeds[indexR], newFeeds[indexL]];
    setFeeds(newFeeds);
    let newFeedContent = [...feedContent];
    [newFeedContent[indexL], newFeedContent[indexR]] = [
      newFeedContent[indexR],
      newFeedContent[indexL],
    ];
    setFeedContent(newFeedContent);
  };

  useEffect(() => {
    if (feedLabel === null) return;
    setFeeds(loaderFeed);
    api.post(`/tools/collection/${feedLabel}`, loaderFeed)
      .then((response: AxiosResponse<CachedResponse<SingleFeedItem[]>>) => {
        setFeedContent(response.data.content);
        setFeeds(loaderFeed);
      })
  }, [feedLabel]);

  const renderFeeds = () => {
    return feedContent.map((value, index) => {
      return (
        <Segment>
          <Feed>
            <SingleFeed
              data={value}
              afterActions={[
                <a onClick={() => removeFeed(index)}>
                  <Icon name="remove" />
                  Remove
                </a>,
                <a
                  onClick={() => swapFeed(index - 1, index)}
                  hidden={index === 0}
                >
                  <Icon name="arrow up" />
                  Up
                </a>,
                <a
                  onClick={() => swapFeed(index + 1, index)}
                  hidden={index + 1 === feedContent.length}
                >
                  <Icon name="arrow down" />
                  Down
                </a>,
              ]}
            />
          </Feed>
        </Segment>
      );
    });
  };

  const sortList = (
    compare: (a: SingleFeedItem, b: SingleFeedItem) => number,
  ) => {
    const newFeedContent = [...feedContent];
    newFeedContent.sort(compare);
    setFeedContent(newFeedContent);
    setFeeds(newFeedContent.map((value) => value.id));
  };

  const sortNewToOld = (a: SingleFeedItem, b: SingleFeedItem) =>
    new Date(b.time).getTime() - new Date(a.time).getTime();
  const sortOldToNew = (a: SingleFeedItem, b: SingleFeedItem) =>
    new Date(a.time).getTime() - new Date(b.time).getTime();

  return (
    <Segment>
      <h1>创建合订本</h1>
      <Form action="/collection/new" method="POST">
        <Form.Input
          label="犇犇 ID"
          value={feed}
          onChange={(_, { value }) => {
            setFeed(value);
          }}
          action
        >
          <input />
          <Button
            type="button"
            labelPosition="right"
            icon
            onClick={addFeed}
            disabled={loading}
            loading={loading}
          >
            添加
            <Icon name="add" />
          </Button>
        </Form.Input>
        <input
          value={feeds.map((value) => value.toString()).join(",")}
          type="hidden"
          name="feeds"
        />
        <div>
          {feedContent.length !== 0 ? (
            <>
              <span>Sort By: </span>
              <Button.Group>
                <Button type="button" onClick={() => sortList(sortNewToOld)}>
                  New to Old
                </Button>
                <Button type="button" onClick={() => sortList(sortOldToNew)}>
                  Old to New
                </Button>
              </Button.Group>
              {renderFeeds()}
            </>
          ) : (
            <Message
              header="Tips"
              content="输入犇犇 ID（单条犇犇左下角 # 开头的是 ID），点击“添加”按钮即可往合订本中加入犇犇！"
            ></Message>
          )}
        </div>
        <div style={{ padding: 10 }}>
          <Turnstile
            sitekey={SITEKEY || ""}
            onVerify={(token) => setToken(token)}
          />
        </div>
        <Button fluid type="submit" disabled={token === undefined}>
          <Icon name="add" />
          创建
        </Button>
      </Form>
    </Segment>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <Segment>
        <h1>出错了</h1>
        <p>
          错误提示：<pre>{error.message}</pre>
        </p>
      </Segment>
    );
  }

  if (!isRouteErrorResponse(error)) {
    return (
      <Segment>
        <h1>出错了</h1>
        <p>这是一个未知错误。</p>
      </Segment>
    );
  }

  return (
    <Segment>
      <h1>出错了</h1>
      <p>
        Error Code: {error.status}
        <br />
        <pre>{error.statusText}</pre>
      </p>
    </Segment>
  );
}
