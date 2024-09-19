import "semantic-ui-css/semantic.min.css";
import "./main.css";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";
import { Button, ButtonGroup, Container } from "semantic-ui-react";

import { Announcement } from "./components/announcement";
import { Footer } from "./components/footer";
import { MainMenu } from "./components/menu";

import { ExternalScript } from "remix-utils/external-scripts";
import ErrorSlot from "./components/errorslot";

export const meta: MetaFunction = () => {
  return [{ title: "犇犇黑历史" }];
};



export const loader = async ({ request }: LoaderFunctionArgs) => {
  let adSense: boolean | null = false;
  if (new URL(request.url).host === "benben.sbs") {
    if (!request.headers.get("cookie")?.includes("noAd=1")) adSense = true;
  } else {
    adSense = null;
  }

  return { adSense };
};

export default function App() {
  useEffect(() => {
    import("./static/clarity.js");
  }, []);

  return (
    <html lang="zh-cn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ExternalScript
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4905414776827944"
          crossOrigin="anonymous"
          async
          defer={false}
        ></ExternalScript>
      </head>
      <body>
        <MainMenu>
          <Announcement />
          <Container>
            <div style={{ padding: "1rem" }}>
              <Outlet />
            </div>
          </Container>
          <Footer />
        </MainMenu>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error: any = useRouteError();

  if (!isRouteErrorResponse(error)) {
    return (
      <ErrorSlot>
        <h1>对不起！出错了！</h1>
        <p>这是一个未知错误。详细信息：</p>
        <pre>{String(error)}</pre>
      </ErrorSlot>
    );
  }

  if (error.status === 404) {
    return (
      <ErrorSlot>
        <h1>404 Not Found - 页面未找到</h1>
        <p>糟糕！页面走丢了。</p>
        <ButtonGroup>
          <Button primary onClick={() => window.history.back()}>
            返回上一页
          </Button>
          <Button as={Link} to="/">
            返回主页
          </Button>
        </ButtonGroup>
      </ErrorSlot>
    );
  }

  if (error.status === 400) {
    return (
      <ErrorSlot>
        <h1>400 Bad Request - 参数错误</h1>
        <p>错误信息：</p>
        <pre>{error.data}</pre>
      </ErrorSlot>
    );
  }

  return (
    <>
      <h1>这似乎是一个未知的错误……</h1>
      <p>
        错误提示：<pre>{String(error)}</pre>
      </p>
    </>
  );
};
