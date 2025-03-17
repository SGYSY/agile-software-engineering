import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  ScheduleOutlined,
  UserOutlined,
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  HistoryOutlined,
  ApartmentOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false); // 管理 Sider 是否展开
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("displayName");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Room List</Link>,
    },
    {
      key: "/my-bookings",
      icon: <ScheduleOutlined />,
      label: <Link to="/my-bookings">My Bookings</Link>,
    },
  ];

  if (userRole === "admin") {
    menuItems.push(
      {
        key: "/admin/dashboard",
        icon: <BarChartOutlined />,
        label: <Link to="/admin/dashboard">Dashboard</Link>,
      },
      {
        key: "/admin",
        icon: <DashboardOutlined />,
        label: <Link to="/admin">Booking Approvals</Link>,
      },
      {
        key: "/admin/bookings",
        icon: <CalendarOutlined />,
        label: <Link to="/admin/bookings">Booking Schedule</Link>,
      },
      {
        key: "/admin/users",
        icon: <TeamOutlined />,
        label: <Link to="/admin/users">User Information</Link>,
      },
      {
        key: "/admin/history",
        icon: <HistoryOutlined />,
        label: <Link to="/admin/history">Booking History</Link>,
      },
      {
        key: "/admin/rooms",
        icon: <ApartmentOutlined />,
        label: <Link to="/admin/rooms">Manage Rooms</Link>,
      }
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#F7F8FA" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={250}
        style={{
          background: "#FFFFFF",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 根据collapsed状态切换 logo */}
        <div
          style={{
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          <img
            src={collapsed ? "/logo2.jpg" : "/logo1.jpg"} // 切换 logo
            alt="University of Dundee"
            style={{
              width: collapsed ? "35px" : "150px", // collapsed 时设置 logo2 为 50px，其他时 logo1 为 150px
              height: "50px", // 设置 logo 的高度为 50px
            }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            padding: "16px 0",
            backgroundColor: "#FFFFFF",
          }}
          onSelect={(item) => {}}
        />
      </Sider>

      <Layout>
        {/* 头部用户信息和登出按钮调整到右侧 */}
        <Header
          style={{
            background: "#FFFFFF",
            textAlign: "right",
            paddingRight: 20,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <UserOutlined style={{ fontSize: 20, marginRight: 10, color: "#4161d9" }} />
            <span style={{ fontSize: 14, color: "#333" }}>
              {userRole
                ? `Logged in as: ${localStorage.getItem("displayName") || userRole}`
                : "Not logged in"}
            </span>
            {userRole && (
              <Button
                type="link"
                onClick={handleLogout}
                style={{ marginLeft: 10, color: "#4161d9" }} // 修改为统一颜色
              >
                Logout
              </Button>
            )}
          </div>
        </Header>

        <Content
          style={{
            margin: "16px",
            padding: "24px",
            background: "#FFFFFF",
            borderRadius: 8,
            minHeight: "calc(100vh - 140px)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: "#FFFFFF",  // 采用白色背景
            padding: "10px 20px",
            borderTop: "1px solid #F0F0F0",
            color: "#999999", // 页脚文字颜色调整为灰色
          }}
        >
          DIICSU Room Booking System ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
