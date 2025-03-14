import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col } from "antd";
import { getBookings, getRooms } from "../utils/demoData";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
    setRooms(JSON.parse(localStorage.getItem("rooms")) || []);
  }, []);

  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.status === "approved").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const rejectedBookings = bookings.filter(b => b.status === "rejected").length;

  return (
    <Card title="Admin Dashboard" style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Total Bookings" value={totalBookings} />
        </Col>
        <Col span={6}>
          <Statistic title="Approved" value={approvedBookings} valueStyle={{ color: "#3f8600" }} />
        </Col>
        <Col span={6}>
          <Statistic title="Pending" value={pendingBookings} valueStyle={{ color: "#faad14" }} />
        </Col>
        <Col span={6}>
          <Statistic title="Rejected" value={rejectedBookings} valueStyle={{ color: "#cf1322" }} />
        </Col>
      </Row>
      <Card type="inner" title="Room Information" style={{ marginTop: 20 }}>
        {rooms.map(room => (
          <p key={room.id}>
            <strong>{room.name}</strong>: Capacity {room.capacity}, Booking Limit {room.bookingLimit}
          </p>
        ))}
      </Card>
      {/* 可在此添加更多图表，例如使用 ECharts 或 Chart.js */}
    </Card>
  );
};

export default AdminDashboard;
