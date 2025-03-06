import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";

const getRooms = () => {
  const storedRooms = localStorage.getItem("rooms");
  if (storedRooms) return JSON.parse(storedRooms);
  
  const defaultRooms = [
    { id: "101", name: "A101", capacity: 50, equipment: ["投影仪", "白板"] },
    { id: "102", name: "B102", capacity: 30, equipment: ["白板"] },
    { id: "103", name: "C203", capacity: 20, equipment: ["无"] },
  ];
  localStorage.setItem("rooms", JSON.stringify(defaultRooms));
  return defaultRooms;
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setRooms(getRooms());
  }, []);

  return (
    <div>
      <h1>教室列表</h1>
      <Row gutter={[16, 16]}>
        {rooms.map((room) => (
          <Col key={room.id} xs={24} sm={12} md={8} lg={6}>
            <Card title={room.name} bordered={false} style={{ textAlign: "center" }}>
              <p>容量: {room.capacity} 人</p>
              <p>设备: {room.equipment.join(", ")}</p>
              <Button type="primary" onClick={() => navigate(`/booking/${room.id}`)}>
                预定
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
