import React, { useState, useEffect } from "react";
import { Card } from "antd";
import ProTable from "@ant-design/pro-table";
import moment from "moment";

const AdminHistory = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const allBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    setBookings(allBookings);
  }, []);

  const columns = [
    { title: "Booking ID", dataIndex: "id", key: "id" },
    { title: "Room", dataIndex: "roomId", key: "roomId" },
    { title: "User", dataIndex: "user", key: "user" },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (time) => moment(time).format("YYYY-MM-DD HH:mm")
    },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Participants", dataIndex: "participants", key: "participants" },
  ];

  return (
    <Card title="Booking History" style={{ padding: 20 }}>
      <ProTable columns={columns} dataSource={bookings} rowKey="id" search={{ labelWidth: "auto" }} />
    </Card>
  );
};

export default AdminHistory;
