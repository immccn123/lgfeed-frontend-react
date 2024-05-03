import {
  Button,
  Icon,
  Input,
  List,
  Segment,
  Statistic,
} from "semantic-ui-react";
import { StatisticsResponse } from "~/interfaces";
import { Link } from "@remix-run/react";
import { SegmentLoader } from "~/components/loader";
import useSWR from "swr";
import { BASE_URL } from "~/utils/api";

import { GridRow, GridColumn, Grid, Image } from "semantic-ui-react";

export default function Index() {
  return (
    <>
      <Segment>
        <h1 style={{ textAlign: "center" }}>犇犇黑历史</h1>
      </Segment>
    </>
  );
}
