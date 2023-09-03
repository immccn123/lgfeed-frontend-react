import { ActionArgs, Response, json, redirect } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import Turnstile from "react-turnstile";
import {
  Button,
  Feed,
  Form,
  Grid,
  Icon,
  Input,
  Segment,
} from "semantic-ui-react";
import { SingleFeed } from "~/components/feed";
import {
  FeedCollectionRequest,
  SingleFeedItem,
  SingleFeedItemResponse,
} from "~/interfaces";
import { createCollection } from "~/models/collection.server";
import { validateTurnstileToken } from "~/turnstile.server";
import { api } from "~/utils/api";
import { randomString } from "~/utils/rand";

export async function loader() {
  return process.env.TURNSTILE_SITEKEY;
}

export async function action({ request, params }: ActionArgs) {
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

  const SITEKEY = useLoaderData();

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
        <Feed>
          {feedContent.map((value, index) => {
            return (
              <>
                <SingleFeed
                  data={value}
                  afterActions={[
                    <a
                      onClick={() => {
                        removeFeed(index);
                      }}
                    >
                      <Icon name="remove" />
                      Remove
                    </a>,
                    <a
                      onClick={() => {
                        swapFeed(index - 1, index);
                      }}
                      hidden={index === 0}
                    >
                      <Icon name="arrow up" />
                      Up
                    </a>,
                    <a
                      onClick={() => {
                        swapFeed(index + 1, index);
                      }}
                      hidden={index + 1 === feedContent.length}
                    >
                      <Icon name="arrow down" />
                      Down
                    </a>,
                  ]}
                />
              </>
            );
          })}
        </Feed>
        <Turnstile
          sitekey={SITEKEY || ""}
          onVerify={(token) => setToken(token)}
        />
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
