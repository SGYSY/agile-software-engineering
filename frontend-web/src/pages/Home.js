import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Input, Select, DatePicker, TimePicker } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Option } = Select;

const getRooms = () => JSON.parse(localStorage.getItem("rooms")) || [];
const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];

// 教室图片映射（根据 roomId 显示不同图片）
const roomImages = {
  "101": "/room1.jpg", // 你可以继续添加更多房间图片
  "102": "/room2.jpg",
  "103": "/room3.jpg"
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [searchParams, setSearchParams] = useState({ capacity: "", equipment: "", date: null, time: null });
  const navigate = useNavigate();

  useEffect(() => {
    setRooms(getRooms());
  }, []);

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Available Rooms</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: 20 }}>
        <Input placeholder="Min Capacity" type="number" style={{ width: 120 }} 
          onChange={(e) => setSearchParams({ ...searchParams, capacity: e.target.value })} />
        <Select placeholder="Select Equipment" style={{ width: 180 }} 
          onChange={(value) => setSearchParams({ ...searchParams, equipment: value })}>
          <Option value="Projector">Projector</Option>
          <Option value="Whiteboard">Whiteboard</Option>
        </Select>
        <DatePicker onChange={(date) => setSearchParams({ ...searchParams, date })} />
        <TimePicker format="HH:mm" onChange={(time) => setSearchParams({ ...searchParams, time })} />
        <Button type="primary" onClick={() => setRooms(getRooms())}>Search</Button>
      </div>

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
              <Button type="primary" onClick={() => navigate(`/booking/${room.id}`)} style={{ borderRadius: "5px" }}>
                Book Now
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
