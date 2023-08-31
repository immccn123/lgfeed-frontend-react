import { useParams } from "@remix-run/react";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Feed, Segment } from "semantic-ui-react";
import { SingleFeed } from "~/components/feed";
import { SegmentLoader } from "~/components/loader";
import { SingleFeedItem, SingleFeedItemResponse } from "~/interfaces";
import { api } from "~/utils/api";

export default function FeedInfo() {
  const [data, setData] = useState<SingleFeedItem | undefined>();
  const { feedId } = useParams();
  feedId as string;

  useEffect(() => {
    api
      .get<SingleFeedItemResponse>(`/tools/getFeed/${feedId}`)
      .then((response: AxiosResponse<SingleFeedItemResponse>) => {
        setData(response.data.content);
      });
  }, []);

  return (
    <>
      <Segment>
        <Feed>{data ? <SingleFeed data={data} /> : <SegmentLoader />}</Feed>
      </Segment>
    </>
  );
}
