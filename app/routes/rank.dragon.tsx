import { Component } from "react";
import { api } from "../utils/api";
import { RankResponse } from "~/interfaces";
import { AxiosResponse } from "axios";
import { Leaderboard } from "~/components/rank";
import {
  Dropdown,
  DropdownItemProps,
  DropdownProps,
  Segment,
} from "semantic-ui-react";
import { SegmentLoader } from "~/components/loader";

interface DragonKingState {
  rank?: RankResponse;
  rankUrl: string;
}

const rankOptions: DropdownItemProps[] = [
  {
    key: "/rank/dragon",
    text: "30 日",
    value: "/rank/dragon",
  },
  {
    key: "/rank/dailyDragon",
    text: "24 小时",
    value: "/rank/dailyDragon",
  },
];

export default class DragonKing extends Component<{}, DragonKingState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      rank: undefined,
      rankUrl: "/rank/dragon",
    };
  }

  getRank() {
    api
      .get<RankResponse>(this.state.rankUrl)
      .then((response: AxiosResponse<RankResponse>) => {
        this.setState({ rank: response.data });
      });
  }

  handleChange = async (
    _: React.SyntheticEvent<HTMLElement>,
    { value }: DropdownProps,
  ) => {
    this.setState({ rankUrl: value?.toString() || "", rank: undefined }, () => {
      this.getRank();
    });
  };

  componentDidMount() {
    this.getRank();
  }

  render() {
    return (
      <div>
        <h1>
          <Dropdown
            inline
            options={rankOptions}
            value={this.state.rankUrl}
            onChange={this.handleChange}
          ></Dropdown>
          龙王榜
        </h1>
        <Segment>
          {this.state.rank ? (
            <>
              <p>
                Last Updated:{" "}
                {new Date(this.state.rank.cached_at * 1000).toLocaleString()}
                <br />
                Update interval: 1 hour
              </p>
              <Leaderboard data={this.state.rank.content || []} />
            </>
          ) : (
            <SegmentLoader />
          )}
        </Segment>
      </div>
    );
  }
}
