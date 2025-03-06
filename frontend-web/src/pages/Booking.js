import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, DatePicker, TimePicker, Button, message, Descriptions } from "antd";
import moment from "moment";

const getRooms = () => JSON.parse(localStorage.getItem("rooms")) || [];
const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];
const saveBooking = (newBooking) => {
  const bookings = getBookings();
  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

const Booking = () => {
  const { roomId } = useParams();
  const rooms = getRooms();
  const room = rooms.find(r => r.id === roomId);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  if (!room) return <p style={{ textAlign: "center", marginTop: 50 }}>未找到教室信息</p>;

  const handleBooking = () => {
    if (!date || !time) {
      return message.error("请选择日期和时间！");
    }

    const startTime = moment(`${date.format("YYYY-MM-DD")} ${time.format("HH:mm")}`).toISOString();
    const newBooking = {
      id: Date.now().toString(),
      roomId,
      user: userRole,
      startTime,
      status: "pending", // 预定默认“待审核”状态
    };
    saveBooking(newBooking);

    message.success("预定提交成功，等待管理员审核！");
    navigate("/my-bookings");
  };

  return (
    <Card title={`预定教室 ${room.name}`} style={{ maxWidth: 600, margin: "20px auto" }}>
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="容量">{room.capacity} 人</Descriptions.Item>
        <Descriptions.Item label="设备">{room.equipment.join(", ")}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 20 }}>
        <DatePicker onChange={setDate} style={{ width: "100%", marginBottom: 10 }} />
        <TimePicker onChange={setTime} format="HH:mm" style={{ width: "100%", marginBottom: 20 }} />
        <Button type="primary" block onClick={handleBooking} size="large">
          提交预定（待审核）
        </Button>
      </div>
    </Card>
  );
};

export default Booking;
