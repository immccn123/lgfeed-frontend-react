import { Button, Icon, Segment, Statistic } from "semantic-ui-react";
import { StatisticsResponse } from "~/interfaces";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const response = await fetch(`https://api-lgf.imken.moe/statistics`);
  const statistics: StatisticsResponse = await response.json();
  return statistics;
};

export default function Index() {
  const data = useLoaderData();

  return (
    <>
      <h1>犇犇保存站</h1>
      <Segment>
        <h2>你站一共发现了</h2>
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
            Updated at: {new Date(data.cached_at * 1000).toLocaleString()}
            <br />
            Update interval: 30s
          </p>
          <Button as={Link} to="/statistics">
            <Icon name="chart pie" />
            查看更多统计信息
          </Button>
        </div>
      </Segment>
      <Segment>
        <h2>关于本站</h2>
        <p>使用 React + Semantic 编写的船新犇犇保存站前端壳子！</p>
        <p>不对数据完整性和正确性负责 有一段时间的数据好像乱了自己看着办懒得处理了ww</p>
        <p>现在新壳子基本上稳定了 以后应该不会大改了哦</p>
        <p>还有，你站一直都是 Imken 一个人运营，而且对外提供 API 接口（https://api-lgf.imken.moe/docs），要用的自取，要开跨域的联系咱就行了哦</p>
        <p>你站不叫 Imken 保存站！！不要拿这个指代你站！！</p>
        <p>咕咕咕</p>
        <p>—— By Imken</p>
        <p>
          如果可以的话，<a href="https://sponsor.imken.moe">投喂支持</a>一下谢谢喵！
        </p>
      </Segment>
    </>
  );
}
