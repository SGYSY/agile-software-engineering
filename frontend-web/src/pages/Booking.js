import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, DatePicker, TimePicker, Button, message, Descriptions } from "antd";
import moment from "moment";
import { getRooms, saveBooking } from "../utils/demoData";

const Booking = () => {
  const { roomId } = useParams();
  const rooms = getRooms();
  const room = rooms.find(r => r.id === roomId);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  if (!room) return <p style={{ textAlign: "center", marginTop: 50 }}>Room not found</p>;

  const handleBooking = () => {
    if (!date || !time) {
      return message.error("Please select a date and time!");
    }

    const startTime = moment(`${date.format("YYYY-MM-DD")} ${time.format("HH:mm")}`).toISOString();
    const newBooking = { id: Date.now().toString(), roomId, user: userRole, startTime, status: "pending" };
    saveBooking(newBooking);
    
    message.success("Booking submitted successfully. Awaiting admin approval!");
    navigate("/my-bookings");
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <Card title={`Book Room: ${room.name}`} style={{ maxWidth: 500, borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}>
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Capacity">{room.capacity} people</Descriptions.Item>
          <Descriptions.Item label="Equipment">{room.equipment.join(", ")}</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 20 }}>
          <DatePicker onChange={setDate} style={{ width: "100%", marginBottom: 10 }} />
          <TimePicker onChange={setTime} format="HH:mm" style={{ width: "100%", marginBottom: 20 }} />
          <Button type="primary" block onClick={handleBooking} size="large" style={{ borderRadius: "5px" }}>
            Submit Booking (Pending Approval)
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Booking;
