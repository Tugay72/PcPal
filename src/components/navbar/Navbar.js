// Navbar.js
import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import './Navbar.css';

const { Header } = Layout;

const Navbar = () => {
  const menu1 = (
    <Menu>
      <Menu.Item>CPU</Menu.Item>
      <Menu.Item>GPU</Menu.Item>
      <Menu.Item>Ram</Menu.Item>
      <Menu.Item>Motherboard</Menu.Item>
      <Menu.Item>Case</Menu.Item>
      <Menu.Item>PSU</Menu.Item>
      <Menu.Item>HDD</Menu.Item>
      <Menu.Item>SSD</Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu>
      <Menu.Item>Work</Menu.Item>
      <Menu.Item>School</Menu.Item>
      <Menu.Item>Gaming</Menu.Item>
      <Menu.Item>Engineer</Menu.Item>
      <Menu.Item>Just Google</Menu.Item>
    </Menu>
  );

  const menu3 = (
    <Menu>
      <Menu.Item>Windows</Menu.Item>
      <Menu.Item>Mac</Menu.Item>
      <Menu.Item>Linux</Menu.Item>
      <Menu.Item>NO OS</Menu.Item>
    </Menu>
  );

  // Fix : Use menu instead of overlay but using menu gives errors
  return (
    <Header className="navbar">
      <div className="logo">PcPal</div>
      <div className="nav-labels">
        <Dropdown overlay={menu1} placement="bottom" arrow>
          <span className="nav-label">PC Parts</span>
        </Dropdown>
        <Dropdown overlay={menu2} placement="bottom" arrow>
          <span className="nav-label">Pre-Builds</span>
        </Dropdown>
        <Dropdown overlay={menu3} placement="bottom" arrow>
          <span className="nav-label">Laptops</span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
