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
} from "@remix-run/react";

import { MainMenu } from "./components/menu";
import { Footer } from "./components/footer";
import { Container } from "semantic-ui-react";
import { Announcement } from "./components/announcement";

export const meta: V2_MetaFunction = () => {
  return [{ title: "犇犇黑历史" }];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
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
