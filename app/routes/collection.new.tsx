import { ActionArgs, Response, json, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import Turnstile from "react-turnstile";
import { Button, Form, Input, Segment } from "semantic-ui-react";
import { FeedCollectionRequest } from "~/interfaces";
import { createCollection } from "~/models/collection.server";
import { validateTurnstileToken } from "~/turnstile.server";
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
  const [feeds, setFeeds] = useState<string>("");
  const [token, setToken] = useState<string | undefined>();

  const SITEKEY = useLoaderData();

  return (
    <Segment>
      <h1>创建合订本</h1>
      <Form action="/collection/new" method="POST">
        <Form.Input
          name="feeds"
          label="犇犇 ID"
          placeholder="半角逗号分隔"
          value={feeds}
          onChange={(_, { value }) => {
            setFeeds(value);
          }}
        ></Form.Input>
        <Turnstile
          sitekey={SITEKEY || ""}
          onVerify={(token) => setToken(token)}
        />
        <Button type="submit" disabled={token === undefined}>
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
