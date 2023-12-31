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
  total: number;
  today: number;
}

export interface FeedItem {
  id: number;
  name: string;
  time: string;
  content: string;
  grab_time: string;
}

export interface UserFeeds {
  user_color: string;
  feeds: FeedItem[];
}

export interface BenbenItem extends FeedItem {
  uid: string | number;
}

export interface FeedCollectionRequest {
  token: string;
  feeds: string;
}

export interface StatisticsMap {
  time: string | Date;
  count: number;
}

export interface RankResponse extends CachedResponse<LeaderboardItem[]> {}
export interface StatisticsResponse extends CachedResponse<Statistics> {}
export interface UserFeedsResponse extends CachedResponse<UserFeeds> {}
export interface BenbenItemResponse extends CachedResponse<BenbenItem> {}
export interface StatisticsMapResponse extends CachedResponse<StatisticsMap> {}
