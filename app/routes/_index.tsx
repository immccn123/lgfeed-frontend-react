import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Loader, Segment, Statistic } from "semantic-ui-react";
import { api } from "~/utils/api";
import { StatisticsResponse } from "~/interfaces";

export default function Index() {
  const [data, setData] = useState<StatisticsResponse | undefined>();

  useEffect(() => {
    api.get<StatisticsResponse>("/statistics")
      .then((response: AxiosResponse<StatisticsResponse>) => {
        setData(response.data);
      })
  });

  return (
    <div>
      <h1>犇犇保存站</h1>
      <Segment>
        <h2>Imken 的服务器娘一共发现了……</h2>
        {
          data ?
            (
              <div>
                <Statistic>
                  <Statistic.Value>{data.content.today}</Statistic.Value>
                  <Statistic.Label>24 小时内犇犇总数</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{data.content.total}</Statistic.Value>
                  <Statistic.Label>数据库内全部犇犇数量</Statistic.Label>
                </Statistic>
                <p>
                  Updated at: {(new Date(data.cached_at * 1000)).toLocaleString()}<br />
                  Update interval: 30s
                </p>
              </div>
            ) : (
              <div style={{ height: 100 }}>
                <Loader active>少女祈祷中……</Loader>
              </div>
            )
        }
      </Segment>
      <Segment>
        <h2>关于本站</h2>
        <p>使用 React + Semantic 编写的船新犇犇保存站前端壳子！</p>
        <p>不对数据完整性和正确性负责</p>
        <p>不知道什么时候可以写完</p>
        <p>咕咕咕</p>
        <p>—— By Imken</p>
        <p><a href="https://sponsor.imken.moe">饿饿，饭饭</a></p>
      </Segment>
    </div>
  );
}
