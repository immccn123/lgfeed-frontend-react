import React from "react";
import { Button, Feed, Icon, Image, Modal } from "semantic-ui-react";
import { FeedItem, SingleFeedItem } from "~/interfaces";
import Markdown from "marked-react";
import { Link } from "@remix-run/react";

import "./styles/feed.css";
import CodeSnippet from "./code";

export const createUidFeed = (
  feed: FeedItem,
  uid: number | string,
): SingleFeedItem => {
  return {
    id: feed.id,
    name: feed.name,
    time: feed.time,
    content: feed.content,
    grab_time: feed.grab_time,
    uid: uid,
  };
};

export interface SingleFeedItemProps {
  data: SingleFeedItem;
}

export const SingleFeed: React.FC<SingleFeedItemProps> = ({ data }) => {
  return (
    <Feed.Event>
      <Feed.Label>
        <Image
          avatar
          src={`https://cdn.luogu.com.cn/upload/usericon/${data.uid}.png`}
        />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>
          <Link to={`/user/${data.uid}`}>{data.name}</Link>
          <Feed.Date>
            Sent at {new Date(data.time).toLocaleString()}, Saved at{" "}
            {new Date(data.grab_time).toLocaleString()}
          </Feed.Date>
        </Feed.Summary>
        <Feed.Extra text className="feed-content">
          <div id={`feed-${data.id}`}>
            <Markdown>{data.content}</Markdown>
          </div>
        </Feed.Extra>
        <Feed.Meta>
          <Link to={`/feed/${data.id}`}>
            <Icon name="linkify" />
            Permalink
          </Link>
          <Modal
            trigger={
              <a>
                <Icon name="code" />
                Show Raw Code
              </a>
            }
            header={`Feed #${data.id} Source Code`}
            content={
              <div style={{ margin: 20, overflow: "scroll" }}>
                <CodeSnippet code={data.content} language="markdown" />
              </div>
            }
            actions={[
              <Button
                onClick={() => {
                  window.navigator.clipboard.writeText(data.content);
                }}
              >
                <Icon name="copy outline" />
                Copy
              </Button>,
              <Button
                onClick={() => {
                  window.navigator.clipboard.writeText(
                    ` || @${data.name} : ${document.getElementById(`feed-${data.id}`)?.innerText}`,
                  );
                }}
              >
                <Icon name="reply" />
                Copy Reply
              </Button>,
              <Button negative>
                <Icon name="close" />
                Close
              </Button>,
            ]}
          />
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
};
