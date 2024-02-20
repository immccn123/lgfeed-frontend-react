import "semantic-ui-css/semantic.min.css";
import "./main.css";

import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import React, { PropsWithChildren, useEffect } from "react";

import { MainMenu } from "./components/menu";
import { Footer } from "./components/footer";
import {
  Button,
  ButtonGroup,
  Container,
  Message,
  Segment,
} from "semantic-ui-react";
import { Announcement } from "./components/announcement";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const meta: MetaFunction = () => {
  return [{ title: "犇犇黑历史" }];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = () => {
  return process.env.ARC_ENV ?? null;
};

export default function App() {
  const navigation = useNavigation();
  const env = useLoaderData<typeof loader>();

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [navigation.state]);

  const arcEnv = useLoaderData<string | null>();

  return (
    <html lang="zh-cn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {arcEnv ? (
          <script src="/_static/clarity.js"></script>
        ) : (
          <script src="/clarity.js"></script>
        )}
      </head>
      <body>
        <MainMenu />
        <Container>
          <Announcement />
          <Outlet />
        </Container>
        <Footer arcEnv={env} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const ErrorSlot: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <html lang="zh-cn">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MainMenu />
        <Container>{children}</Container>
        <Footer disablePoweredBy />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <ErrorSlot>
        <h1>出错了</h1>
        <p>
          错误提示：<pre>{String(error)}</pre>
        </p>
      </ErrorSlot>
    );
  }

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
        <h1>404 Not Found</h1>
        <h2>你似乎来到了没有知识的荒原……</h2>
        <p>（并不）（指知乎）</p>
        <p>考虑</p>
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

  return (
    <>
      <h1>出错了</h1>
      <p>
        错误提示：<pre>{String(error)}</pre>
      </p>
    </>
  );
};
