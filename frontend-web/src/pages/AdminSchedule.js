import React, { useState, useEffect } from "react";
import { Calendar, Card } from "antd";

const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];

const AdminSchedule = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings().filter(b => b.status === "approved"));
  }, []);

  return (
    <Card title="教室预定时间表">
      <Calendar
        dateCellRender={(date) => {
          const formattedDate = date.format("YYYY-MM-DD");
          const dayBookings = bookings.filter(b => b.startTime.startsWith(formattedDate));

          return (
            <ul>
              {dayBookings.map(b => (
                <li key={b.id}>{b.roomId} - {new Date(b.startTime).toLocaleTimeString()} ({b.user})</li>
              ))}
            </ul>
          );
        }}
      />
    </Card>
  );
};

export default AdminSchedule;
