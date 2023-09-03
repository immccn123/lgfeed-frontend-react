import { RankResponse } from "~/interfaces";
import { Leaderboard } from "~/components/rank";
import { Segment } from "semantic-ui-react";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const response = await fetch(`https://api-lgf.imken.moe/rank/pingOthers`);
  const rank: RankResponse = await response.json();
  return rank;
};

export default function Index() {
  const data = useLoaderData();

  return (
    <div>
      <h1>30 日艾特榜</h1>
      <Segment>
        <p>
          Last Updated: {new Date(data.cached_at * 1000).toLocaleString()}
          <br />
          Update interval: 1 hour
        </p>
        <Leaderboard data={data.content} />
      </Segment>
    </div>
  );
}
