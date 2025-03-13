import React from "react";
import { Layout, Menu, Button } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { HomeOutlined, ScheduleOutlined, UserOutlined, DashboardOutlined, CalendarOutlined } from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">Room List</Link> },
    { key: "/my-bookings", icon: <ScheduleOutlined />, label: <Link to="/my-bookings">My Bookings</Link> },
  ];

  if (userRole === "admin") {
    menuItems.push(
      { key: "/admin", icon: <DashboardOutlined />, label: <Link to="/admin">Booking Approvals</Link> },
      { key: "/admin/bookings", icon: <CalendarOutlined />, label: <Link to="/admin/bookings">Booking Schedule</Link> }
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible style={{ background: "#001529" }}>
        <div style={{ color: "white", textAlign: "center", padding: "16px 0", fontSize: "18px", fontWeight: "bold" }}>
          DIICSU Room Booking System
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", textAlign: "right", paddingRight: 20 }}>
          <UserOutlined style={{ fontSize: 20, marginRight: 10 }} />
          <span>{userRole ? `Logged in as: ${userRole}` : "Not logged in"}</span>
          {userRole && <Button type="link" onClick={handleLogout} style={{ marginLeft: 10 }}>Logout</Button>}
        </Header>

        <Content style={{ margin: "16px", padding: "16px", background: "#fff", borderRadius: 8 }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          DIICSU Room Booking System ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
