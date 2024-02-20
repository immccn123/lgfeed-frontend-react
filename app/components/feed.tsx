import React from "react";
import { Button, Feed, Icon, Image, Modal } from "semantic-ui-react";
import { FeedItem, BenbenItem } from "~/interfaces";
import Markdown from "marked-react";
import { Link } from "@remix-run/react";

import "./styles/feed.css";
import CodeSnippet from "./code";

export const createUidFeed = (
  feed: FeedItem,
  uid: number | string,
): BenbenItem => {
  return {
    id: feed.id,
    name: feed.name,
    time: feed.time,
    content: feed.content,
    grab_time: feed.grab_time,
    uid: uid,
  };
};

export interface BenbenItemProps {
  data: BenbenItem;
  afterActions?: React.ReactNode[];
}

export const Benben: React.FC<BenbenItemProps> = ({ data, afterActions }) => {
  const copyReply = () =>
    window.navigator.clipboard.writeText(
      ` || @${data.name} : ${document.getElementById(`feed-${data.id}`)
        ?.innerText}`,
    );

  const copyText = () => window.navigator.clipboard.writeText(data.content);

  const rawFeedContent = (
    <div style={{ margin: 20, overflow: "scroll" }}>
      <CodeSnippet code={data.content} language="markdown" />
    </div>
  );

  const feedActions = [
    <Button onClick={copyText}>
      <Icon name="copy outline" />
      Copy
    </Button>,
    <Button onClick={copyReply}>
      <Icon name="reply" />
      Copy Reply
    </Button>,
    <Button negative>
      <Icon name="close" />
      Close
    </Button>,
  ];

  const summary = (
    <>
      <Link to={`/user/${data.uid}`}>{data.name}</Link>
      <Feed.Date>
        Sent at {new Date(data.time).toLocaleString()}, Saved at{" "}
        {new Date(data.grab_time).toLocaleString()}
      </Feed.Date>
    </>
  );

  const metaActions = (
    <>
      <span>#{data.id} </span>
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
        content={rawFeedContent}
        actions={feedActions}
      />
      {afterActions !== undefined ? { ...afterActions } : null}
    </>
  );

  return (
    <Feed.Event>
      <Feed.Label>
        <Image
          avatar
          src={`https://cdn.luogu.com.cn/upload/usericon/${data.uid}.png`}
        />
      </Feed.Label>
      <Feed.Content>
        <Feed.Summary>{summary}</Feed.Summary>
        <Feed.Extra text className="feed-content">
          <div id={`feed-${data.id}`}>
            <Markdown>{data.content}</Markdown>
          </div>
        </Feed.Extra>
        <Feed.Meta>{metaActions}</Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
};
