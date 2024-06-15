export type ProcessState =
  | "STOPPED"
  | "STARTING"
  | "RUNNING"
  | "BACKOFF"
  | "STOPPING"
  | "EXITED"
  | "FATAL"
  | "UNKNOWN";

export interface ProcStatus {
  fetcher_status: ProcessState;
  loop_status: ProcessState;
}

export interface LeaderboardItem {
  uid: number | string;
  name: string;
  count: number;
}

export interface CachedResponse<ContentType> {
  cached_at: number;
  content: ContentType;
}

export interface Statistics {
  total_count: number;
  today_count: number;
  today_user: number;
  total_user: number;
}

export interface FeedItem {
  id: number;
  username: string;
  time: string;
  content: string;
  grabTime: string;
}

export interface UserFeeds {
  feeds: BenbenItem[];
  count: number;
}

export interface BenbenItem extends FeedItem {
  userId: string | number;
}

export interface FeedCollectionRequest {
  token: string;
  feeds: string;
}

export interface StatisticsMap {
  time: string | Date;
  count: number;
}

export type RankResponse = LeaderboardItem[];
export type StatisticsResponse = Statistics
export type UserFeedsResponse = UserFeeds
export type BenbenItemResponse = BenbenItem
export type StatisticsMapResponse = StatisticsMap
