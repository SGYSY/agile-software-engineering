import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";

const getRooms = () => JSON.parse(localStorage.getItem("rooms")) || [];

// 教室图片映射（根据 roomId 显示不同图片）
const roomImages = {
  "101": "/room1.jpg",
  "102": "/room2.jpg",
  "103": "/room3.jpg",
  "104": "/room4.jpg",  // 新增第四个房间的图片映射
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRooms(getRooms());
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{
        textAlign: "center",
        marginBottom: "30px",
        fontSize: "32px",
        fontWeight: "600",
        color: "#4161d9", // 设置标题颜色为 #4161d9
        textTransform: "uppercase", // 改成大写字母
        letterSpacing: "2px", // 增加字母间距
        fontFamily: "Arial, sans-serif", // 设置现代字体
      }}>
        Available Rooms
      </h1>
      <Row gutter={[16, 16]}>
        {rooms.map((room) => (
          <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt="room"
                  src={roomImages[room.id] || "/default-room.jpg"}
                  style={{
                    height: "200px",
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
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.15)";
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>
                {room.name}
              </h3>
              <p style={{ color: "#888" }}>Capacity: {room.capacity} people</p>
              <p style={{ color: "#888" }}>Equipment: {room.equipment.join(", ")}</p>
              <div>
                <Button
                  type="primary"
                  onClick={() => navigate(`/booking/${room.id}`)}
                  style={{
                    borderRadius: "5px",
                    marginRight: "10px",
                    backgroundColor: "#4161d9", // 使用新颜色
                    borderColor: "#4161d9", // 使用新颜色
                    color: "white",
                  }}
                >
                  Book Now
                </Button>
                <Button
                  onClick={() => navigate(`/room/${room.id}`)}
                  style={{
                    borderRadius: "5px",
                    borderColor: "#4161d9", // 使用新颜色
                    color: "#4161d9", // 使用新颜色
                  }}
                >
                  View Schedule
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
