import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Badge, Popover, List } from "antd";
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
  BellOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content, Footer } = Layout;
const API_BASE = "http://47.113.186.66:8080/api";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    fetch(`${API_BASE}/notifications/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data || []))
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
  
    fetch(`${API_BASE}/notifications/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data || []))
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("displayName");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">Room List</Link>,
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
        key: "/admin/users",
        icon: <TeamOutlined />,
        label: <Link to="/admin/users">User Information</Link>,
      },
      {
        key: "/admin/rooms",
        icon: <ApartmentOutlined />,
        label: <Link to="/admin/rooms">Manage Rooms</Link>,
      }
    );
  }

  const notificationContent = (
    <div
      style={{
        maxWidth: 300,
        maxHeight: 200,
        overflowY: "auto",
      }}
    >
      {notifications.length === 0 ? (
        <p style={{ margin: 0 }}>No new notifications.</p>
      ) : (
        <List
          size="small"
          dataSource={notifications.slice(0, 3)}
          renderItem={(item) => (
            <List.Item style={{ whiteSpace: "normal" }}>
              {item.message}
            </List.Item>
          )}
        />
      )}
    </div>
  );
  

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
        <div
          style={{
            textAlign: "center",
            padding: "16px 0",
          }}
        >
          <img
            src={collapsed ? "/logo2.jpg" : "/logo1.jpg"}
            alt="University of Dundee"
            style={{
              width: collapsed ? "35px" : "150px",
              height: "50px",
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
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#FFFFFF",
            textAlign: "right",
            paddingRight: 20,
            borderBottom: "1px solid #F0F0F0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 16,
            }}
          >
            <Popover
              title="Notifications"
              content={notificationContent}
              trigger="click"
              placement="bottomRight"
            >
              <Badge dot={notifications.length > 0}>
                <BellOutlined style={{ fontSize: 20, color: "#4161d9", cursor: "pointer" }} />
              </Badge>
            </Popover>

            <UserOutlined style={{ fontSize: 20, color: "#4161d9" }} />
            <span style={{ fontSize: 14, color: "#333" }}>
              {userRole
                ? `Logged in as: ${localStorage.getItem("displayName") || userRole}`
                : "Not logged in"}
            </span>
            {userRole && (
              <Button
                type="link"
                onClick={handleLogout}
                style={{ marginLeft: 5, color: "#4161d9" }}
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
            background: "#FFFFFF",
            padding: "10px 20px",
            borderTop: "1px solid #F0F0F0",
            color: "#999999",
          }}
        >
          DIICSU Room Booking System ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
