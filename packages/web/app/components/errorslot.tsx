import "semantic-ui-css/semantic.min.css";
import "../main.css";

import { Links, Meta, Scripts } from "@remix-run/react";
import { PropsWithChildren } from "react";
import { ExternalScript } from "remix-utils/external-scripts";
import { MainMenu } from "./menu";
import { Announcement } from "./announcement";
import { Container } from "semantic-ui-react";
import { Footer } from "./footer";
import { ClientOnly } from "remix-utils/client-only";

export default function ErrorSlot({ children }: PropsWithChildren) {
  return (
    <>
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
          <ClientOnly>
            {() => (
              <>
                <MainMenu>
                  <Announcement />
                  <Container>
                    <div style={{ padding: "1rem" }}>{children}</div>
                  </Container>
                  <Footer />
                </MainMenu>
              </>
            )}
          </ClientOnly>
          <Scripts />
          {/* <ScrollRestoration /> */}
        </body>
      </html>
    </>
  );
}
