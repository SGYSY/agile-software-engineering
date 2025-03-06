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
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">教室列表</Link> },
    { key: "/my-bookings", icon: <ScheduleOutlined />, label: <Link to="/my-bookings">我的预定</Link> },
  ];

  if (userRole === "admin") {
    menuItems.push(
      { key: "/admin", icon: <DashboardOutlined />, label: <Link to="/admin">预定审核</Link> },
      { key: "/admin/bookings", icon: <CalendarOutlined />, label: <Link to="/admin/bookings">预定时间表</Link> }
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible style={{ background: "#001529" }}>
        <div style={{ color: "white", textAlign: "center", padding: "16px 0", fontSize: "18px" }}>
          DIICSU 预定系统
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", textAlign: "right", paddingRight: 20 }}>
          <UserOutlined style={{ fontSize: 20, marginRight: 10 }} />
          <span>{userRole ? `当前角色: ${userRole}` : "未登录"}</span>
          {userRole && <Button type="link" onClick={handleLogout} style={{ marginLeft: 10 }}>退出</Button>}
        </Header>

        <Content style={{ margin: "16px", padding: "16px", background: "#fff", borderRadius: 8 }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          DIICSU 教室预定系统 ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
