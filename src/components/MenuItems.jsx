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
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/gameQ/main">
        <NavLink to="/gameQ/main">Main page</NavLink>
      </Menu.Item>
      <Menu.Item key="/gameQ/nftBalance">
        <NavLink to="/gameQ/nftBalance">🖼 NFTs</NavLink>
      </Menu.Item>
      <Menu.Item key="/gameQ/contract">
        <NavLink to="/gameQ/contract">📄 Contract</NavLink>
      </Menu.Item>
      <Menu.Item key="/gameQ/lobbies">
        <NavLink to="/gameQ/lobbies"> Lobbies</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
