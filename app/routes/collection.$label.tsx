import { LoaderArgs, Response } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Feed, List, Segment } from "semantic-ui-react";
import { SingleFeed } from "~/components/feed";
import { CachedResponse, SingleFeedItem } from "~/interfaces";
import { getCollection } from "~/models/collection.server";

export const loader = async ({ params }: LoaderArgs) => {
  const { label } = params;
  const collection = await getCollection(label as string);
  if (collection === null) {
    throw new Response("Collection Not Found", { status: 404 });
  }
  const response = await fetch(
    `https://api-lgf.imken.moe/tools/collection/${label}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(collection.feeds),
    },
  );
  const feedResponse: CachedResponse<SingleFeedItem[]> = await response.json();
  return json({
    collection,
    feeds: feedResponse.content,
  });
};

export default function CollectionPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <Segment>
      <h1>合订本 #{data.collection.label}</h1>
      <Feed>
        {data.feeds.map((value) => {
          return <SingleFeed data={value} />;
        })}
      </Feed>
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

  if (error.status === 404) {
    return (
      <Segment>
        <h1>出错了</h1>
        <p>合订本未找到。</p>
      </Segment>
    );
  }

  return (
    <Segment>
      <h1>出错了</h1>
      <p>
        错误提示：<pre>{error.statusText}</pre>
      </p>
    </Segment>
  );
}
