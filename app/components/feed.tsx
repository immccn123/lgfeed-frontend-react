import React from "react";
import { Feed, Image } from "semantic-ui-react";
import { FeedItem } from "~/interfaces";
import Markdown from 'marked-react';
import { Link } from "@remix-run/react";

export const createUidFeed = (feed: FeedItem, uid: number | string): SingleFeedItem => {
  return {
    id: feed.id,
    name: feed.name,
    time: feed.time,
    content: feed.content,
    grab_time: feed.grab_time,
    uid: uid,
  }
}

export interface SingleFeedItem extends FeedItem {
  uid: string | number;
}

export interface SingleFeedItemProps {
  data: SingleFeedItem;
}

export const SingleFeed: React.FC<SingleFeedItemProps> = ({ data }) => {
  return (
    <Feed.Event>
      <Feed.Label>
        <Image avatar src={`https://cdn.luogu.com.cn/upload/usericon/${data.uid}.png`} />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Link to={`/user/${data.uid}`}>{data.name}</Link>
          <Feed.Date>
            Sent at {(new Date(data.time)).toLocaleString()},
            Saved at {(new Date(data.grab_time)).toLocaleString()}
          </Feed.Date>
        </Feed.Summary>
        <Feed.Extra text>
          <Markdown>{data.content}</Markdown>
        </Feed.Extra>
        <Feed.Meta>
          <Link to={`/feed/${data.id}`}>Permalink</Link>
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
}