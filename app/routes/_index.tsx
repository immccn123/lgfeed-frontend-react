import { Button, Icon, Segment, Statistic } from "semantic-ui-react";
import { StatisticsResponse } from "~/interfaces";
import { Link } from "@remix-run/react";
import { SegmentLoader } from "~/components/loader";
import useSWR from "swr";
import { BASE_URL } from "~/utils/api";

export default function Index() {
  const { data } = useSWR<StatisticsResponse>(
    `${BASE_URL}/statistics`,
    (url: string) => fetch(url).then((res) => res.json()),
  );

  const statisticContent = (
    <Segment>
      <h2>统计</h2>
      {data ? (
        <div>
          <Statistic>
            <Statistic.Value>{data.today}</Statistic.Value>
            <Statistic.Label>24 小时内犇犇总数</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{data.total}</Statistic.Value>
            <Statistic.Label>数据库内全部犇犇数量</Statistic.Label>
          </Statistic>
          {/* <br />
          <Button as={Link} to="/statistics">
            <Icon name="chart pie" />
            查看更多统计信息
          </Button> */}
        </div>
      ) : (
        <SegmentLoader />
      )}
    </Segment>
  );

  const aboutContent = (
    <Segment>
      <h2>关于本站</h2>
      <p>顾名思义（？）就是保存你谷犇犇的地方</p>
      <p>有一段时间的数据好像乱了自己看着办懒得处理了ww</p>
      <p>咕咕咕</p>
      <p>—— By Imken</p>
      <p>
        如果可以的话，<a href="https://sponsor.imken.moe">投喂支持</a>
        一下谢谢喵！
      </p>
    </Segment>
  );

  const extraContent = (
    <>
      <Segment>
        <h2>劳动节假期计划内维护的主要内容</h2>
        <ul>
          <li>
            将搜索后端从数据库暴力检索更换至{" "}
            <a href="https://github.com/valeriansaliou/sonic">Sonic</a> 或者 Meilisearch！
          </li>
          <li>接口后端将会使用 Rxxx 语言重构！</li>
          <li>移除接口中间的缓存层</li>
          <li>还有什么呢？</li>
        </ul>
      </Segment>
    </>
  );

  return (
    <>
      <h1>犇犇保存站</h1>
      {statisticContent}
      {aboutContent}
      {extraContent}
    </>
  );
}
