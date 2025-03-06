import React, { useEffect, useState } from "react";
import { List, Card } from "antd";

const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    setBookings(getBookings().filter(b => b.user === userRole && b.status === "approved"));
  }, []);

  return (
    <div>
      <h1>我的预定（已批准）</h1>
      <List
        dataSource={bookings}
        renderItem={(item) => (
          <Card title={item.roomId} style={{ marginBottom: 16 }}>
            <p>时间: {new Date(item.startTime).toLocaleString()}</p>
          </Card>
        )}
      />
    </div>
  );
};

export default MyBookings;
