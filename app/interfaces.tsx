
export interface LeaderboardItem {
  uid: number | string;
  name: string;
  count: number;
}

export interface LeaderboardProps {
  data: LeaderboardItem[];
}

export interface RankResponse {
  cached_at: number;
  content: LeaderboardItem[];
}
