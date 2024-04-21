import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Feed, Segment } from "semantic-ui-react";
import { Benben } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import { BenbenItem, BenbenItemResponse } from "~/interfaces";
import { BASE_URL, api } from "~/utils/api";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return params;
};

export default function FeedInfo() {
  const { feedId } = useLoaderData<typeof loader>();
  const [benben, setBenben] = useState<BenbenItem>();

  useEffect(() => {
    api
      .get<BenbenItemResponse>(`${BASE_URL}/tools/getFeed/${feedId}`)
      .then(({ data }) => setBenben(data));
  }, []);

  return (
    <Segment>
      <Feed>{benben ? <Benben data={benben} /> : <SegmentLoader />}</Feed>
    </Segment>
  );
}
