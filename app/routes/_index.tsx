import { useState } from "react";
import {
  Button,
  Feed,
  Icon,
  Label,
  LabelDetail,
  List,
  ListItem,
  Statistic,
  StatisticLabel,
  StatisticValue,
  PlaceholderParagraph,
  PlaceholderLine,
  PlaceholderHeader,
  Placeholder,
} from "semantic-ui-react";
import useSWR from "swr";

import AnimatedNumber from "~/components/animated_number";
import { Benben } from "~/components/feed";
import { BenbenItem, ProcStatus, StatisticsResponse } from "~/interfaces";
import { getColorByProcStatus, couldProcRestart } from "~/utils";
import { api, fetcher } from "~/utils/api";
import showNotification from "~/utils/notify";

const MyStatistic = ({
  label,
  value,
  trailing,
}: {
  label: string;
  value?: number;
  trailing: string;
}) => (
  <Statistic size="tiny">
    <StatisticLabel>{label}</StatisticLabel>
    <StatisticValue>
      {value !== undefined ? (
        <>
          <AnimatedNumber value={value} /> {trailing}
        </>
      ) : (
        <Placeholder fluid>
          <PlaceholderLine />
        </Placeholder>
      )}
    </StatisticValue>
  </Statistic>
);

function BackendStatus() {
  const { data, error, mutate } = useSWR<ProcStatus>(`/proc/status`, fetcher, {
    refreshInterval: 5000,
  });
  const [fetcherRestarting, setFetcherRestarting] = useState(false);
  const [loopRestarting, setLoopRestarting] = useState(false);

  if (data === undefined)
    return (
      <Placeholder fluid>
        <PlaceholderLine />
        <PlaceholderLine />
      </Placeholder>
    );

  if (error) {
    return (
      <p>
        后端可能已经去世了（这个好像没法凭借阁下的一己之力重启了）。。。
        <br />
        或者是网络有问题？
      </p>
    );
  }

  const restarter = (proc: "fetcher" | "loop") => () => {
    if (proc === "fetcher") setFetcherRestarting(true);
    else setLoopRestarting(true);

    api
      .get(`/proc/start?proc=${proc}`)
      .then(() => showNotification("已经发出启动进程请求", "success"))
      .catch((e) => showNotification(String(e), "error"))
      .finally(() => {
        if (proc === "fetcher") setFetcherRestarting(false);
        else setLoopRestarting(false);
        mutate();
      });
  };

  return (
    <>
      <List divided selection>
        <ListItem>
          轮询抓取器：
          <Label color={getColorByProcStatus(data.fetcher_status)}>
            {data.fetcher_status}

            {couldProcRestart(data.fetcher_status) ? (
              <LabelDetail>
                <Button
                  size="mini"
                  labelPosition="left"
                  color="green"
                  onClick={restarter("fetcher")}
                  disabled={fetcherRestarting}
                  loading={fetcherRestarting}
                >
                  <Icon name="redo" />
                  点击尝试重启
                </Button>
              </LabelDetail>
            ) : null}
          </Label>
        </ListItem>
        <ListItem>
          循环抓取器：
          <Label color={getColorByProcStatus(data.loop_status)}>
            {data.loop_status}

            {couldProcRestart(data.loop_status) ? (
              <LabelDetail>
                <Button
                  size="mini"
                  labelPosition="left"
                  color="green"
                  onClick={restarter("loop")}
                  disabled={loopRestarting}
                  loading={loopRestarting}
                >
                  <Icon name="redo" />
                  点击尝试重启
                </Button>
              </LabelDetail>
            ) : null}
          </Label>
        </ListItem>
      </List>
    </>
  );
}

export default function Index() {
  const {
    data: randomBenben,
    mutate: mutateRandomBenben,
    isValidating: isBenbenValidating,
  } = useSWR<BenbenItem>(`/tools/getRandom`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
  });

  const { data: statistics } = useSWR<StatisticsResponse>(
    `/statistics`,
    fetcher,
  );

  return (
    <>
      <h1 style={{ textAlign: "center" }}>犇犇黑历史</h1>
      <h2>统计数据</h2>
      <MyStatistic
        label="共计保存犇犇"
        value={statistics?.total_count}
        trailing="条"
      />
      <MyStatistic
        label="近 24 小时内共计保存"
        value={statistics?.today_count}
        trailing="条"
      />

      <h2>随机犇犇</h2>
      {randomBenben ? (
        <>
          <Feed>
            <Benben data={randomBenben}></Benben>
          </Feed>
        </>
      ) : (
        <>
          <Placeholder fluid>
            <PlaceholderHeader image>
              <PlaceholderLine />
              <PlaceholderLine />
            </PlaceholderHeader>
            <PlaceholderParagraph>
              <PlaceholderLine />
              <PlaceholderLine />
            </PlaceholderParagraph>
          </Placeholder>
          <div style={{ height: 20 }}></div>
        </>
      )}

      <Button
        onClick={() => mutateRandomBenben()}
        disabled={isBenbenValidating}
        loading={isBenbenValidating}
      >
        <Icon name="refresh" />
        换一个
      </Button>

      <h2>爬虫状态</h2>
      <p>
        因学业繁忙，可能没有时间时时刻刻盯着服务器状态了，所以只有麻烦大家一起盯一下）
      </p>
      <BackendStatus />
    </>
  );
}
