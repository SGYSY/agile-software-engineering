import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, message, Badge, List, Tabs } from "antd";
import { useNavigate } from "react-router-dom";

// API 基地址
const API_BASE = "http://47.113.186.66:8080/api";  // 统一 API 基地址

// 新的图片映射：房间ID 8-26 对应图片文件 1.jpg 至 19.jpg
const getRoomImage = (roomId) => {
  const idNum = parseInt(roomId, 10);
  if (idNum >= 8 && idNum <= 26) {
    return `/${idNum - 7}.jpg`;
  }
  return "/default-room.jpg";
};

const Home = () => {
  const [rooms, setRooms] = useState([]); // 初始化为空数组
  const [bookings, setBookings] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);  // 控制 Drawer 显示
  const [loadingBookings, setLoadingBookings] = useState(false);  // 控制加载状态
  const [selectedTab, setSelectedTab] = useState("all");  // 当前选中的 Tab（筛选状态）
  const navigate = useNavigate();

  // 获取房间信息
  const fetchRooms = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        message.error("User not authenticated.");
        return;
      }
      const response = await fetch(`${API_BASE}/rooms`, {
        headers: {
          Authorization: `Bearer ${userToken}`,  // 添加 token 认证
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      message.error("Failed to fetch room information");
    }
  };

  // 获取用户的预订记录
  const fetchBookings = async (userId) => {
    setLoadingBookings(true);
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken || !userId) {
        message.error("User not authenticated or userId missing.");
        return;
      }
      const response = await fetch(`${API_BASE}/bookings/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,  // 添加 token 认证
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch booking records");
    } finally {
      setLoadingBookings(false);
    }
  };

  // 获取选中的状态的预订记录
  const filterBookingsByStatus = (status) => {
    if (status === "all") {
      return bookings;
    }
    return bookings.filter((item) => item.status === status);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");  // 从 localStorage 获取当前用户ID
    if (userId) {
      fetchRooms();  // 获取房间信息
      fetchBookings(userId);  // 获取当前用户的预订记录
    } else {
      message.error("User not logged in");
    }
  }, []);

  // 处理点击“我的预订”按钮，显示预订记录
  const handleShowBookings = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchBookings(userId);
      setDrawerVisible(true);  // 打开 Drawer
    }
  };

  // 关闭 Drawer
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* "Available Rooms" Header and My Bookings Button */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "600",
            color: "#4161d9",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Available Rooms
        </h1>
        <Button type="primary" onClick={handleShowBookings}>
          My Bookings
        </Button>
      </div>

      {/* Rooms Display */}
      <Row gutter={[16, 16]}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt="room"
                    src={getRoomImage(room.id)}  // 确保图片显示
                    style={{
                      height: "160px", // 调整大小
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                }
                style={{
                  textAlign: "center",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0, 0, 0, 0.15)";
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
                  {room.name}
                </h3>
                <p style={{ color: "#888" }}>Capacity: {room.capacity} people</p>
                <p style={{ color: "#888" }}>Location: {room.location}</p>
                <div>
                  <Button
                    type="primary"
                    onClick={() => navigate(`/roomissue/${room.id}`)}
                    style={{
                      borderRadius: "5px",
                      marginRight: "10px",
                      backgroundColor: "#4161d9",
                      borderColor: "#4161d9",
                      color: "white",
                    }}
                  >
                    Room Issue
                  </Button>
                  <Button
                    onClick={() => navigate(`/room/${room.id}`)}
                    style={{
                      borderRadius: "5px",
                      borderColor: "#4161d9",
                      color: "#4161d9",
                    }}
                  >
                    View Schedule
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <p>No rooms available.</p>
        )}
      </Row>

      {/* My Bookings Drawer */}
      {drawerVisible && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "20px",
            width: "360px",
            maxHeight: "70vh",
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            padding: "16px",
            overflowY: "auto",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>My Bookings</h3>
            <Button type="link" onClick={handleCloseDrawer}>
              Close
            </Button>
          </div>

          <Tabs
            defaultActiveKey="all"
            onChange={(key) => setSelectedTab(key)}
            style={{ marginBottom: 16 }}
          >
            <Tabs.TabPane tab="All" key="all" />
            <Tabs.TabPane tab="Pending" key="pending" />
            <Tabs.TabPane tab="Approved" key="confirmed" />
            <Tabs.TabPane tab="Cancelled" key="cancelled" />
          </Tabs>

          {loadingBookings ? (
            <p>Loading...</p>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={filterBookingsByStatus(selectedTab)}
              locale={{ emptyText: "No bookings found" }}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  style={{
                    background: "#fafafa",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <h4>{item.room.name}</h4>
                  <p>
                    <strong>Time: </strong>
                    {new Date(item.startTime).toLocaleString()} -{" "}
                    {new Date(item.endTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status: </strong>
                    <Badge
                      status={item.status === "pending" ? "warning" : "success"}
                      text={item.status}
                    />
                  </p>
                </List.Item>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
