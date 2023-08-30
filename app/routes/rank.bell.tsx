import { useState, useEffect } from "react";
import { api } from '../utils/api';
import { RankResponse } from "~/interfaces";
import { AxiosResponse } from 'axios';
import { Leaderboard } from "~/components/rank";
import { Loader, Segment } from "semantic-ui-react";

export default function Index() {
  const [data, setData] = useState<RankResponse>({
    cached_at: 0,
    content: [],
  });

  useEffect(() => {
    api.get<RankResponse>('/rank/bePinged')
      .then((response: AxiosResponse<RankResponse>) => {
        setData(response.data);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  return (
    <div>
      <h1>铃铛榜</h1>
      <Segment>
        {data.content.length > 0 ? (
          <div>
            <p>Last Updated: {(new Date(data.cached_at * 1000)).toLocaleString()}<br />Update interval: 1 hour</p>
            <Leaderboard data={data.content || []} />
          </div>
        ) : (
          <div style={{ height: 100 }}>
            <Loader active>加载中……</Loader>
          </div>
        )}
      </Segment>
    </div>
  );
}
