import { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Feed, Segment } from "semantic-ui-react";
import { Benben } from "~/components/feed";
import { BenbenItemResponse } from "~/interfaces";

export const loader = async ({ params }: LoaderArgs) => {
  const { feedId } = params;
  const response = await fetch(
    `https://api-lgf.imken.dev/tools/getFeed/${feedId}`,
  );
  const data: BenbenItemResponse = await response.json();
  return data;
};

export default function FeedInfo() {
  const data = useLoaderData();

  return (
    <>
      <Segment>
        <Feed>
          <Benben data={data.content} />
        </Feed>
      </Segment>
    </>
  );
}
