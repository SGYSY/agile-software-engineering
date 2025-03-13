import React, { useState, useEffect } from "react";
import { Button, message, Card, Badge } from "antd";
import ProTable from "@ant-design/pro-table";
import { saveNotification, getBookings, updateBookingStatus } from "../utils/demoData"; 

const Admin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleApprove = (id) => {
    updateBookingStatus(id, "approved");
    const booking = getBookings().find(b => b.id === id);
    saveNotification(booking.user, `Your booking for room ${booking.roomId} has been approved.`);
    message.success("Booking approved!");
    setBookings(getBookings());
  };

  const handleReject = (id) => {
    updateBookingStatus(id, "rejected");
    message.warning("Booking rejected!");
    setBookings(getBookings());
  };

  const columns = [
    { title: "Room", dataIndex: "roomId", key: "roomId" },
    { title: "Booked By", dataIndex: "user", key: "user" },
    { 
      title: "Time", 
      dataIndex: "startTime", 
      key: "startTime", 
      render: time => new Date(time).toLocaleString() 
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      render: status => (
        <Badge
          status={status === "approved" ? "success" : status === "pending" ? "warning" : "error"}
          text={status === "approved" ? "✅ Approved" : status === "pending" ? "⏳ Pending" : "❌ Rejected"}
        />
      ) 
    },
    {
      title: "Actions",
      render: (_, record) => record.status === "pending" && (
        <>
          <Button type="primary" onClick={() => handleApprove(record.id)} style={{ marginRight: 10 }}>Approve</Button>
          <Button danger onClick={() => handleReject(record.id)}>Reject</Button>
        </>
      )
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h1>Booking Approval (Admin)</h1>
      <Card style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}>
        <ProTable columns={columns} dataSource={bookings} rowKey="id" search={{ labelWidth: "auto" }} />
      </Card>
    </div>
  );
};

export default Admin;
