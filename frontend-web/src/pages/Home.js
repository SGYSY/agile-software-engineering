import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";

const getRooms = () => JSON.parse(localStorage.getItem("rooms")) || [];

// 教室图片映射（根据 roomId 显示不同图片）
const roomImages = {
  "101": "/room1.jpg",
  "102": "/room2.jpg",
  "103": "/room3.jpg",
  "104": "/room4.jpg"  // 新增第四个房间的图片映射
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRooms(getRooms());
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Available Rooms</h1>
      <Row gutter={[16, 16]}>
        {rooms.map((room) => (
          <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img 
                  alt="room" 
                  src={roomImages[room.id] || "/default-room.jpg"} 
                  style={{ height: "200px", objectFit: "cover" }} 
                />
              }
              style={{ textAlign: "center", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
            >
              <h3>{room.name}</h3>
              <p>Capacity: {room.capacity} people</p>
              <p>Equipment: {room.equipment.join(", ")}</p>
              <Button 
                type="primary" 
                onClick={() => navigate(`/booking/${room.id}`)} 
                style={{ borderRadius: "5px", marginRight: 10 }}
              >
                Book Now
              </Button>
              <Button onClick={() => navigate(`/room/${room.id}`)}>View Schedule</Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
