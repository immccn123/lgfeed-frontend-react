import {
  Button,
  Feed,
  Icon,
  Input,
  List,
  Segment,
  Statistic,
  StatisticLabel,
  StatisticValue,
} from "semantic-ui-react";
import { BenbenItem, StatisticsResponse } from "~/interfaces";
import { Link } from "@remix-run/react";
import { SegmentLoader } from "~/components/loader";
import useSWR from "swr";
import { BASE_URL, fetcher } from "~/utils/api";

import { GridRow, GridColumn, Grid, Image } from "semantic-ui-react";
import useSWRImmutable from "swr/dist/immutable";
import { Benben } from "~/components/feed";

import {
  PlaceholderParagraph,
  PlaceholderLine,
  PlaceholderHeader,
  Placeholder,
} from "semantic-ui-react";
import AnimatedNumber from "~/components/animated_number";

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
      {value ? (
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
      {/* <MyStatistic
        label="累计发犇用户"
        value={statistics?.total_user}
        trailing="个"
      />
      <MyStatistic
        label="近 24 小时内发犇用户"
        value={statistics?.today_user}
        trailing="个"
      /> */}

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
        onClick={() => {
          mutateRandomBenben();
        }}
        disabled={isBenbenValidating}
        loading={isBenbenValidating}
      >
        <Icon name="refresh" />
        换一个
      </Button>
    </>
  );
}
