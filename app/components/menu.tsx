import { Menu } from "semantic-ui-react";
import { Link, useLocation } from "@remix-run/react";

export const MainMenu = () => {
  const location = useLocation();

  return (
    <Menu fixed="top">
      <Menu.Item
        as={Link}
        to="/"
        active={location.pathname === "/"}
        name="首页"
      />
      <Menu.Item
        as={Link}
        to="/rank/dragon"
        active={location.pathname === "/rank/dragon"}
        name="龙王榜"
      />
      <Menu.Item
        as={Link}
        to="/rank/bell"
        active={location.pathname === "/rank/bell"}
        name="铃铛榜"
      />
      <Menu.Item
        as={Link}
        to="/rank/at"
        active={location.pathname === "/rank/at"}
        name="艾特榜"
      />
      <Menu.Item
        as={Link}
        to="/user"
        active={location.pathname.startsWith("/user")}
        name="用户历史"
      />
    </Menu>
  );
};
