import React, { useEffect, useState } from "react";
import { List, Card, Button, message, Badge } from "antd";
import { getBookings, deleteBooking, getNotifications, markNotificationAsRead } from "../utils/demoData"; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setBookings(getBookings().filter(b => b.user === userRole));
    setNotifications(getNotifications().filter(n => n.user === userRole));
  }, [userRole]);

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>My Bookings</h1>

      <h2>Notifications</h2>
      <List
        dataSource={notifications}
        renderItem={(notification) => (
          <Card style={{ marginBottom: 16, background: notification.read ? "#f0f0f0" : "#e6f7ff" }}>
            <p>{notification.message}</p>
            {!notification.read && (
              <Button type="link" onClick={() => markNotificationAsRead(notification.id)}>Mark as Read</Button>
            )}
          </Card>
        )}
      />

      <h2>Booking List</h2>
      <List
        dataSource={bookings}
        renderItem={(item) => (
          <Card title={`Room: ${item.roomId}`} style={{ marginBottom: 16 }}>
            <p>Time: {new Date(item.startTime).toLocaleString()}</p>
            <p>Status: <Badge status={item.status === "approved" ? "success" : "warning"} text={item.status} /></p>
            {item.status === "pending" && <Button danger onClick={() => deleteBooking(item.id)}>Cancel</Button>}
          </Card>
        )}
      />
    </div>
  );
};

export default MyBookings;
