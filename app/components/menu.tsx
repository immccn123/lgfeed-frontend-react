import { Dropdown, Icon, Menu } from "semantic-ui-react";
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
      {/* <Dropdown item text="排行榜">
        <Dropdown.Menu>
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
        </Dropdown.Menu>
      </Dropdown> */}
      <Dropdown item text="工具">
        <Dropdown.Menu>
          <Menu.Item
            as={Link}
            to="/tools/at"
            active={location.pathname.startsWith("/tools/at")}
            name="谁在拍我铃铛？"
          />
        </Dropdown.Menu>
      </Dropdown>
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
  );
};
