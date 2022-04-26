import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
        marginLeft: "400px",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/gameQ/lobbies">
        <NavLink to="/gameQ/lobbies">Game</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
