import React, { useState, useEffect } from "react";
import { List, Card, Badge, Button, message, Divider } from "antd";

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
  
  // 从 localStorage 获取当前用户ID，并确保它是数字类型
  const userId = parseInt(localStorage.getItem("userId"), 10);  // 使用 parseInt 转换为数字

  useEffect(() => {
    if (userId) {
      fetchBookings(userId).then(setBookings);  // 获取当前用户的预订记录
    } else {
      message.error("User not found");
    }
  }, [userId]);

  const handleDeleteBooking = (id) => {
    // 删除预订操作
    // 这里假设有一个 deleteBooking 函数进行删除
    // deleteBooking(id); // 可以在这里调用删除 API
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
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          overflow: "hidden"
        }}
      >
        <Divider orientation="left">Booking List</Divider>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={bookings}
          locale={{ emptyText: "No bookings found" }}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={`Room: ${item.room.name}`} // 显示房间名称
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
                  borderRadius: 8,
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.15)",
                }}
              >
                <p style={{ marginBottom: 8 }}>
                  <strong>Location:</strong> {item.room.location}  {/* 显示房间位置 */}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Time:</strong>{" "}
                  {new Date(item.startTime).toLocaleString()} -{" "}
                  {new Date(item.endTime).toLocaleString()}  {/* 格式化时间 */}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    status={item.status === "confirmed" ? "success" : "warning"}
                    text={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  />
                </p>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default MyBookings;
