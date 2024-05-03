import React, { useState } from "react";
import { Button, Feed, Icon, Image, Modal, Popup } from "semantic-ui-react";
import { BenbenItem } from "~/interfaces";
import Markdown from "marked-react";
import { Link } from "@remix-run/react";
import { AwesomeQR } from "awesome-qr";
import html2canvas from "html2canvas";

import "./styles/feed.css";
import CodeSnippet from "./code";
import { takeSnapshot } from "~/utils/snapshot";

const generateQRCode = (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    new AwesomeQR({
      text: text,
      size: 120,
    })
      .draw()
      .then((buf) => {
        if (typeof buf === "string") resolve(buf);
        const blob = new Blob([buf as ArrayBuffer], { type: "image/png" });
        reader.readAsDataURL(blob);
      });
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (e) => {
      reject(e);
    };
  });
};

export interface BenbenItemProps {
  data: BenbenItem;
  afterActions?: React.ReactNode[];
  hideOperations?: boolean;
}

export const Benben: React.FC<BenbenItemProps> = ({
  data,
  afterActions,
  hideOperations,
}) => {
  const [linkQR, setLinkQR] = useState<string>();

  const copyReply = () =>
    window.navigator.clipboard.writeText(
      ` || @${data.username} : ${document.getElementById(`feed-${data.id}`)
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
      复制
    </Button>,
    <Button onClick={copyReply}>
      <Icon name="reply" />
      复制回复文本
    </Button>,
    <Button negative>
      <Icon name="close" />
      关闭
    </Button>,
  ];

  const summary = (
    <>
      <Link to={`/user/${data.userId}`}>{data.username}</Link>
      <Feed.Date>
        发送于 {new Date(data.time).toLocaleString()}，保存于{" "}
        {new Date(data.grabTime).toLocaleString()}
      </Feed.Date>
    </>
  );

  const metaActions = hideOperations ? (
    <span>#{data.id} </span>
  ) : (
    <>
      <span>#{data.id} </span>
      <Link to={`/feed/${data.id}`}>
        <Icon name="linkify" />
        永久链接
      </Link>
      <Popup
        flowing
        hoverable
        onOpen={() => {
          if (linkQR === undefined)
            generateQRCode(
              new URL(`/feed/${data.id}`, location.origin).toString(),
            ).then((x) => setLinkQR(x));
          // takeSnapshot(<Benben data={data} hideOperations={true} />).then((x) =>
          //   console.log(x),
          // );
        }}
        trigger={
          <a>
            <Icon name="share square" />
            分享
          </a>
        }
      >
        {linkQR ? <Image src={linkQR} /> : null}
        <span>
          手机扫描二维码或者
          <Link
            to={`#`}
            onClick={() => {
              window.navigator.clipboard.writeText(
                new URL(`/feed/${data.id}`, location.origin).toString(),
              );
            }}
          >
            复制链接
          </Link>
        </span>
      </Popup>
      <Modal
        trigger={
          <a>
            <Icon name="code" />
            查看 Markdown 源码
          </a>
        }
        header={`犇犇 #${data.id} Markdown 源码`}
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
          src={`https://cdn.luogu.com.cn/upload/usericon/${data.userId}.png`}
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
