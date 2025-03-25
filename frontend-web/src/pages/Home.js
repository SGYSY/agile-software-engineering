import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, message, Badge, List, Tabs } from "antd";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://47.113.186.66:8080/api";

const getRoomImage = (roomId) => {
  const idNum = parseInt(roomId, 10);
  if (idNum >= 8 && idNum <= 26) {
    return `/${idNum - 7}.jpg`;
  }
  return "/default-room.jpg";
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) return;
      const response = await fetch(`${API_BASE}/rooms`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const data = await response.json();
      setRooms(data);
    } catch {
      message.error("Failed to fetch room information");
    }
  };

  const fetchBookings = async (userId) => {
    setLoadingBookings(true);
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken || !userId) return;
      const response = await fetch(`${API_BASE}/bookings/user/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const data = await response.json();
      setBookings(data);
    } catch {
      message.error("Failed to fetch booking records");
    } finally {
      setLoadingBookings(false);
    }
  };

  const filterBookingsByStatus = (status) => {
    return status === "all" ? bookings : bookings.filter((item) => item.status === status);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchRooms();
      fetchBookings(userId);
    } else {
      message.error("User not logged in");
    }
  }, []);

  const handleShowBookings = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchBookings(userId);
      setDrawerVisible(true);
    }
  };

  const handleCloseDrawer = () => setDrawerVisible(false);

  return (
    <div style={{ padding: "40px", background: "#eef1f7", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif", borderRadius: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
        <h1 style={{ margin: 0, fontSize: "36px", fontWeight: 700, color: "#4161d9" }}>Available Rooms</h1>
        <Button type="primary" size="large" onClick={handleShowBookings} style={{ backgroundColor: "#4161d9", borderColor: "#4161d9" }}>
          My Bookings
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img alt="room" src={getRoomImage(room.id)} style={{ height: 160, objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s ease",
                  textAlign: "center"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{room.name}</h3>
                <p style={{ margin: 0, color: "#777" }}>Capacity: {room.capacity} people</p>
                <p style={{ margin: "4px 0 12px", color: "#999" }}>{room.location}</p>
                <div>
                  <Button
                    type="primary"
                    onClick={() => navigate(`/roomissue/${room.id}`)}
                    style={{ borderRadius: 6, marginRight: 8, backgroundColor: "#4161d9", borderColor: "#4161d9" }}
                  >
                    Room Issue
                  </Button>
                  <Button
                    onClick={() => navigate(`/room/${room.id}`)}
                    style={{ borderRadius: 6, borderColor: "#4161d9", color: "#4161d9" }}
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

      {drawerVisible && (
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 30,
            width: 380,
            maxHeight: "75vh",
            background: "#ffffff",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
            padding: 20,
            overflowY: "auto",
            zIndex: 10
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>My Bookings</h3>
            <Button type="link" onClick={handleCloseDrawer}>Close</Button>
          </div>

          <Tabs defaultActiveKey="all" onChange={setSelectedTab} style={{ marginBottom: 16 }}>
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
                    background: "#f8f9fb",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12
                  }}
                >
                  <h4 style={{ marginBottom: 4 }}>{item.room.name}</h4>
                  <p style={{ marginBottom: 4 }}><strong>Time:</strong> {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}</p>
                  <p style={{ marginBottom: 0 }}>
                    <strong>Status: </strong>
                    <Badge
                      status={item.status === "pending" ? "warning" : item.status === "confirmed" ? "success" : "default"}
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
