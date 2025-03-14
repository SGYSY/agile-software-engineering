import React, { useEffect, useState } from "react";
import { List, Card, Button, message, Badge, Divider } from "antd";
import { getBookings, deleteBooking, getNotifications, markNotificationAsRead } from "../utils/demoData";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setBookings(getBookings().filter(b => b.user === userRole));
    setNotifications(getNotifications().filter(n => n.user === userRole));
  }, [userRole]);

  const refreshNotifications = () => {
    setNotifications(getNotifications().filter(n => n.user === userRole));
  };

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
    message.success("Notification marked as read.");
    refreshNotifications();
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
        <Divider orientation="left">Notifications</Divider>
        <List
          dataSource={notifications}
          locale={{ emptyText: "No notifications" }}
          itemLayout="vertical"
          renderItem={(notification) => (
            <Card
              size="small"
              style={{
                marginBottom: 16,
                background: notification.read ? "#fafafa" : "#e6f7ff",
                borderRadius: 4,
              }}
            >
              <p style={{ marginBottom: 8 }}>{notification.message}</p>
              {!notification.read && (
                <Button type="link" onClick={() => handleMarkAsRead(notification.id)}>
                  Mark as Read
                </Button>
              )}
            </Card>
          )}
        />

        <Divider orientation="left">Booking List</Divider>
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={bookings}
          locale={{ emptyText: "No bookings found" }}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={`Room: ${item.roomId}`}
                extra={
                  item.status === "pending" && (
                    <Button type="primary" danger size="small" onClick={() => deleteBooking(item.id)}>
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
                  <strong>Time:</strong> {new Date(item.startTime).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge 
                    status={item.status === "approved" ? "success" : "warning"} 
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
