import { Link, useLocation } from "@remix-run/react";
import {
  Button,
  Menu,
  Message,
  Sidebar,
  SidebarPushable,
  SidebarPusher,
} from "semantic-ui-react";
import { useWindowSize } from "@uidotdev/usehooks";
import React, { useState } from "react";

export const MainMenu = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { width } = useWindowSize();

  const shouldAlwaysDisplay = (width ?? 0) > 900;

  return (
    <>
      <SidebarPushable style={{ transform: "none" }}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          onHide={() => setVisible(false)}
          vertical
          visible={shouldAlwaysDisplay || visible}
          width="thin"
          style={{ height: "100vh !important", position: "fixed" }}
        >
          <Menu.Item style={{ fontSize: "large" }}>犇站</Menu.Item>
          <Menu.Item
            as={Link}
            to="/"
            active={location.pathname === "/"}
            name="首页"
          />
          <Menu.Item
            as={Link}
            to="/tools/at"
            active={location.pathname.startsWith("/tools/at")}
            name="被 at 查询"
          />
          <Menu.Item
            as={Link}
            to="/tools/circle"
            active={location.pathname.startsWith("/tools/circle")}
            name="犇圈"
          />
          <Menu.Item
            as={Link}
            to="/user"
            active={location.pathname.startsWith("/user")}
            name="用户历史"
          />
          <Menu.Item
            as={Link}
            to="/search"
            active={location.pathname.startsWith("/search")}
            name="高级检索"
          />
        </Sidebar>

        <SidebarPusher
          dimmed={!shouldAlwaysDisplay && visible}
          style={{
            paddingLeft: shouldAlwaysDisplay ? "150px" : undefined,
            transition: ".5s",
            minHeight: "100vh",
          }}
        >
          {!shouldAlwaysDisplay && (
            <Message
              style={{
                border: "none",
                boxShadow: "none",
                borderRadius: "0",
                margin: "0",
              }}
            >
              <Button basic icon="bars" onClick={() => setVisible(true)} />
              <span style={{ fontSize: "large" }}>犇站</span>
            </Message>
          )}
          {children}
        </SidebarPusher>
      </SidebarPushable>
    </>
  );
};
