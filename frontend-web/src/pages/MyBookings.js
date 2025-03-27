import React, { useState, useEffect } from "react";
import { List, Card, Badge, Button, message, Divider, Row, Col, Spin } from "antd";

// API 基地址
const API_BASE = "http://47.113.186.66:8080/api";

// 获取当前用户的所有预订
const fetchBookings = async (userId) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    message.error("Failed to fetch booking data");
    return [];
  }
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading 状态

  // 从 localStorage 获取当前用户ID，并确保它是数字类型
  const userId = parseInt(localStorage.getItem("userId"), 10);

  useEffect(() => {
    if (userId) {
      fetchBookings(userId).then((data) => {
        setBookings(data);
        setLoading(false);
      });
    } else {
      message.error("User not found");
    }
  }, [userId]);

  const handleDeleteBooking = (id) => {
    // 删除预订操作
    message.success("Booking cancelled.");
    fetchBookings(userId).then(setBookings);  // 刷新预订列表
  };

  return (
    <div style={{ padding: 32, background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title="My Bookings"
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <Divider orientation="left">Booking List</Divider>

        {/* Loading 状态 */}
        {loading ? (
          <Spin size="large" tip="Loading bookings..." />
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1, // 手机端显示一列
              sm: 2, // 小屏幕显示两列
              md: 3, // 中等屏幕显示三列
              lg: 4, // 大屏幕显示四列
            }}
            dataSource={bookings}
            locale={{ emptyText: "No bookings found" }}
            renderItem={(item) => (
              <List.Item>
                <Card
                  title={`Room: ${item.room.name}`}
                  extra={
                    item.status === "pending" && (
                      <Button
                        type="primary"
                        danger
                        size="small"
                        onClick={() => handleDeleteBooking(item.id)}
                      >
                        Cancel
                      </Button>
                    )
                  }
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    background: "#ffffff",
                    padding: "16px",
                  }}
                >
                  <p style={{ marginBottom: 8 }}>
                    <strong>Location:</strong> {item.room.location}
                  </p>
                  <p style={{ marginBottom: 8 }}>
                    <strong>Time:</strong>{" "}
                    {new Date(item.startTime).toLocaleString()} -{" "}
                    {new Date(item.endTime).toLocaleString()}
                  </p>
                  <p style={{ marginBottom: 8 }}>
                    <strong>Status:</strong>{" "}
                    <Badge
                      status={
                        item.status === "confirmed" ? "success" : "warning"
                      }
                      text={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    />
                  </p>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default MyBookings;
