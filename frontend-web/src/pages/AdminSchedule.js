import React, { useState, useEffect } from "react";
import { Calendar, Card, List } from "antd";
import moment from "moment";
import { getBookings } from "../utils/demoData";
import { useNavigate } from "react-router-dom";

const AdminSchedule = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings().filter(b => b.status === "approved"));
  }, []);

  const dateCellRender = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const dayBookings = bookings.filter(b => moment(b.startTime).format("YYYY-MM-DD") === formattedDate);

    return (
      <div 
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/admin/day-schedule/${formattedDate}`)}
      >
        <List
          size="small"
          dataSource={dayBookings}
          renderItem={(b) => (
            <List.Item>
              <strong>{b.roomId}</strong> - {new Date(b.startTime).toLocaleTimeString()} ({b.user})
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>Room Booking Schedule</h1>
      <Card style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}>
        <Calendar dateCellRender={dateCellRender} />
      </Card>
    </div>
  );
};

export default AdminSchedule;
