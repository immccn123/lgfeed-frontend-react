import "semantic-ui-css/semantic.min.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import { useEffect } from "react";

import { MainMenu } from "./components/menu";
import { Footer } from "./components/footer";
import { Container, Segment } from "semantic-ui-react";
import { Announcement } from "./components/announcement";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const meta: V2_MetaFunction = () => {
  return [{ title: "犇犇黑历史" }];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  return (
    <html lang="zh-cn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <script src="/clarity.js"></script>
      </head>
      <body>
        <MainMenu />
        <div style={{ height: 50 }}></div>
        <Container>
          <Announcement />
          <Outlet />
        </Container>
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <Segment>
        <h1>出错了</h1>
        <p>
          错误提示：<pre>{error.message}</pre>
        </p>
      </Segment>
    );
  }

  if (!isRouteErrorResponse(error)) {
    return (
      <Segment>
        <h1>对不起！出错了！</h1>
        <p>这是一个未知错误。</p>
      </Segment>
    );
  }

  if (error.status === 404) {
    return (
      <Segment>
        <h1>出错了</h1>
        <p>合订本未找到。</p>
      </Segment>
    );
  }

  return (
    <Segment>
      <h1>出错了</h1>
      <p>
        错误提示：<pre>{error.statusText}</pre>
      </p>
    </Segment>
  );
};
