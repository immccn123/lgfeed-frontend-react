import { Link, useLocation } from "@remix-run/react";
import { Dropdown, Icon, Menu } from "semantic-ui-react";

export const MainMenu = () => {
  const location = useLocation();

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        paddingBottom: "10px",
      }}
    >
      <Menu>
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
          name="被&at;查询"
        />
        <Menu.Item
          as={Link}
          to="/tools/circle"
          active={location.pathname.startsWith("/tools/at")}
          name="Benben Circle"
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
      </Menu>
    </div>
  );
};
