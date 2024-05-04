import React, { useEffect, useMemo, useState } from "react";
import { Button, Feed, Icon, Image, Modal, Popup } from "semantic-ui-react";
import { BenbenItem } from "~/interfaces";
import Markdown from "marked-react";
import { Link } from "@remix-run/react";
import { AwesomeQR } from "awesome-qr";

import "./styles/feed.css";
import CodeSnippet from "./code";
import html2canvas from "html2canvas";
import { dataURItoBlob, join } from "~/utils";

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
  const [imgSrc, setImgSrc] = useState<string>();
  const [copyDone, setCopyDone] = useState(false);
  const [replyCopyDone, setReplyCopyDone] = useState(false);
  const id = `benben-${data.id}`;

  useEffect(() => {
    const src = `https://cdn.luogu.com.cn/upload/usericon/${data.userId}.png`;
    fetch(src).then(() => setImgSrc(src));
  }, [data.userId]);

  const copyReply = () => {
    const el = document.getElementById(`feed-${data.id}`) as HTMLElement;
    navigator.clipboard.writeText(` || @${data.username} : ${el.innerText}`);
    setReplyCopyDone(true);
  };

  const copyText = useMemo(
    () => () => navigator.clipboard.writeText(data.content),
    [data.content],
  );
  const copyLink = useMemo(
    () => () =>
      navigator.clipboard.writeText(
        new URL(`/feed/${data.id}`, location.origin).toString(),
      ),
    [data.id],
  );

  const genImg = (operation: "copy" | "download") => {
    const el = document.querySelector(`#${id}`) as HTMLElement;
    const width = el.style.width;
    const padding = el.style.padding;

    el.style.width = "600px";
    el.style.padding = "10px";

    html2canvas(el, { allowTaint: true, useCORS: true, imageTimeout: 1000 })
      .then((x) => x.toDataURL())
      .then((data) => {
        el.style.width = width;
        el.style.padding = padding;

        if (operation === "download") {
          const link = document.createElement("a");
          link.download = `${id}.png`;
          link.href = data;
          link.click();
        } else {
          navigator.clipboard
            .write([new ClipboardItem({ "image/png": dataURItoBlob(data) })])
            .then(() => setCopyDone(true));
        }
      });
  };

  const rawFeedContent = useMemo(
    () => (
      <div style={{ margin: 20, overflow: "scroll" }}>
        <CodeSnippet code={data.content} language="markdown" />
      </div>
    ),
    [data.content],
  );

  const feedActions = useMemo(
    () => [
      <Button onClick={copyText}>
        <Icon name="copy outline" />
        复制
      </Button>,
      <Button negative>
        <Icon name="close" />
        关闭
      </Button>,
    ],
    [data.content],
  );

  const summary = useMemo(
    () => (
      <>
        <Link to={`/user/${data.userId}`}>{data.username}</Link>
        <Feed.Date>
          发送于 {new Date(data.time).toLocaleString()}，保存于{" "}
          {new Date(data.grabTime).toLocaleString()}
        </Feed.Date>
      </>
    ),
    [data.id],
  );

  const shareItems = useMemo(
    () => [
      <>
        {linkQR ? <Image src={linkQR} /> : null}
        扫描二维码
      </>,
      <a className="clickable" onClick={copyLink}>
        复制链接
      </a>,
      <a className="clickable" onClick={() => genImg("download")}>
        下载截图
      </a>,
      <Popup
        trigger={
          <a className="clickable" onClick={() => genImg("copy")}>
            复制截图
          </a>
        }
        open={copyDone}
        onClose={() => setCopyDone(false)}
      >
        复制完成！
      </Popup>,
    ],
    [linkQR],
  );

  const share = (
    <Popup
      flowing
      hoverable
      onOpen={() => {
        if (linkQR === undefined)
          generateQRCode(
            new URL(`/feed/${data.id}`, location.origin).toString(),
          ).then((x) => setLinkQR(x));
      }}
      trigger={
        <a>
          <Icon name="share square" />
          分享
        </a>
      }
    >
      {...join(shareItems, " | ")}
    </Popup>
  );

  const reply = (
    <Popup
      trigger={
        <a onClick={copyReply}>
          <Icon name="reply" />
          回复
        </a>
      }
      open={replyCopyDone}
      onClose={() => setReplyCopyDone(false)}
    >
      回复文本已复制！
    </Popup>
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
      {reply}
      {share}
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
    <Feed.Event id={id}>
      <Feed.Label>
        <Image avatar src={imgSrc} id={`${id}-avatar`} />
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
