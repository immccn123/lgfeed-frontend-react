import { StatisticsMapResponse } from "~/interfaces";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import { useLoaderData } from "@remix-run/react";
import { Segment } from "semantic-ui-react";

export const loader = async () => {
  const now = new Date().getTime();
  const [responseHour, responseDays] = await Promise.all([
    fetch(
      `https://api-lgf.imken.dev/statistics/24h?date=${
        Math.floor(now / 60 / 60) * 3600
      }`,
    ),
    fetch(
      `https://api-lgf.imken.dev/statistics/60d?date=${
        Math.floor(now / 60 / 60) * 3600
      }`,
    ),
  ]);
  const statisticsHour: StatisticsMapResponse = await responseHour.json();
  const statisticsDays: StatisticsMapResponse = await responseDays.json();
  return { statisticsHour, statisticsDays };
};

export default function Statistics() {
  const { statisticsHour, statisticsDays } = useLoaderData<{
    statisticsHour: StatisticsMapResponse;
    statisticsDays: StatisticsMapResponse;
  }>();

  return (
    <>
      <Segment>
        <h2>近 24h 犇犇统计（每小时）</h2>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <LineChart width={1000} height={350} data={statisticsHour.content}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip />
          </LineChart>
        </div>
      </Segment>
      <Segment>
        <h2>近 60 天每日犇犇统计</h2>
        <div style={{ overflowX: "scroll", overflowY: "hidden" }}>
          <LineChart width={1000} height={550} data={statisticsDays.content}>
            <Line type="monotone" dataKey="count" stroke="#d07e98" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip />
          </LineChart>
        </div>
      </Segment>
    </>
  );
}
