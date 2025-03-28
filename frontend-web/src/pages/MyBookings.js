import React, { useState, useEffect } from "react";
import { List, Card, Badge, Button, message, Divider, Row, Col, Spin } from "antd";

const API_BASE = "http://47.113.186.66:8080/api";

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
  const [loading, setLoading] = useState(true);

  const userId = parseInt(localStorage.getItem("userId"), 10);

  const dayOfWeekMap = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
  };

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
    message.success("Booking cancelled.");
    fetchBookings(userId).then(setBookings);
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

        {}
        {loading ? (
          <Spin size="large" tip="Loading bookings..." />
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
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
                    <strong>Date:</strong> {"Week " + item.weekNumber} , {dayOfWeekMap[item.dayOfWeek]}
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
