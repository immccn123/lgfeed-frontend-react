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
  useNavigation,
  useRouteError,
} from "@remix-run/react";
import nProgress from "nprogress";
import { PropsWithChildren, useEffect, FC } from "react";
import { Button, ButtonGroup, Container } from "semantic-ui-react";

import { Announcement } from "./components/announcement";
import { Footer } from "./components/footer";
import { MainMenu } from "./components/menu";

import "nprogress/nprogress.css";
import { ExternalScript } from "remix-utils/external-scripts";

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
  const navigation = useNavigation();

  useEffect(() => {
    import("./static/clarity.js");
  }, []);

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      nProgress.start();
    } else {
      nProgress.done();
    }
  }, [navigation.state]);

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
        <MainMenu />
        <Container>
          <Announcement shouldShowAd={false} />
          <Outlet />
        </Container>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const ErrorSlot: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <MainMenu />
      <Container>{children}</Container>
      {/* <Footer disablePoweredBy /> */}
      <ScrollRestoration />
      {/* <Scripts /> */}
    </>
  );
};

export const ErrorBoundary = () => {
  const error: any = useRouteError();

  nProgress.done();

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
