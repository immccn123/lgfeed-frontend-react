import { LoaderArgs, Response } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { List, Segment } from "semantic-ui-react";
import { getCollection } from "~/models/collection.server";

export const loader = async ({ params }: LoaderArgs) => {
  const { label } = params;
  const collection = await getCollection(label as string);
  if (collection === null) {
    throw new Response("Collection Not Found", { status: 404 });
  }
  return json(collection);
};

export default function CollectionPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <Segment>
      <h1>合订本 #{data.label}</h1>
      <List>
        {data.feeds.map((value) => {
          return <List.Item content={
            <Link to={`/feed/${value}`}>Feed #{value}</Link>
          } />;
        })}
      </List>
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
