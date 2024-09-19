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
import "./styles/menu.css";

import MdiHome from "~icons/mdi/home?width=2em&height=2em";
import MdiDotsCircle from "~icons/mdi/dots-circle?width=2em&height=2em";
import MdiAlternateEmail from "~icons/mdi/alternate-email?width=2em&height=2em";
import MdiHistory from "~icons/mdi/history?width=2em&height=2em";
import MdiSearch from "~icons/mdi/search?width=2em&height=2em";

export const MainMenu = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const { width } = useWindowSize();

  const shouldAlwaysDisplay = (width ?? 0) > 850;

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
          width={shouldAlwaysDisplay ? "very thin" : "thin"}
          style={{ height: "100vh !important", position: "fixed" }}
        >
          {/* <Menu.Item style={{ fontSize: "large" }}>犇站</Menu.Item> */}
          <Menu.Item as={Link} to="/" active={location.pathname === "/"}>
            <MdiHome />
            <br />
            <span className="menu-label">首页</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/tools/at"
            active={location.pathname.startsWith("/tools/at")}
          >
            <MdiAlternateEmail />
            <br />
            <span className="menu-label">被 at 查询</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/tools/circle"
            active={location.pathname.startsWith("/tools/circle")}
          >
            <MdiDotsCircle />
            <br />
            <span className="menu-label">犇圈</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/user"
            active={location.pathname.startsWith("/user")}
          >
            <MdiHistory />
            <br />
            <span className="menu-label">用户历史</span>
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/search"
            active={location.pathname.startsWith("/search")}
          >
            <MdiSearch />
            <br />
            <span className="menu-label">高级检索</span>
          </Menu.Item>
        </Sidebar>

        <SidebarPusher
          dimmed={!shouldAlwaysDisplay && visible}
          style={{
            paddingLeft: shouldAlwaysDisplay ? "80px" : undefined,
            transition: ".5s",
            minHeight: "100vh",
          }}
        >
          {!shouldAlwaysDisplay && (
            <Message
              style={{
                // border: "none",
                boxShadow: "none",
                borderRadius: "0",
                margin: "0",
                position: "fixed",
                top: "0",
                width: "100%",
                zIndex: "999",
              }}
            >
              <Button basic icon="bars" onClick={() => setVisible(true)} />
              <span style={{ fontSize: "large" }}>犇站</span>
            </Message>
          )}
          {!shouldAlwaysDisplay && (
            <div style={{ height: "calc(50px + 1em)" }}></div>
          )}
          {children}
        </SidebarPusher>
      </SidebarPushable>
    </>
  );
};
