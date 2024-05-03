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
export interface StatisticsResponse extends Statistics {}
export interface UserFeedsResponse extends UserFeeds {}
export interface BenbenItemResponse extends BenbenItem {}
export interface StatisticsMapResponse extends StatisticsMap {}
