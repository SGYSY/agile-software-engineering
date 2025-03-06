import React, { useState, useEffect } from "react";
import { Button, message, Card } from "antd";
import ProTable from "@ant-design/pro-table";

const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];
const updateBookingStatus = (id, status) => {
  const bookings = getBookings().map(b => (b.id === id ? { ...b, status } : b));
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

const Admin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const handleApprove = (id) => {
    updateBookingStatus(id, "approved");
    message.success("预定已批准");
    setBookings(getBookings());
  };

  const handleReject = (id) => {
    updateBookingStatus(id, "rejected");
    message.warning("预定已拒绝");
    setBookings(getBookings());
  };

  const columns = [
    { title: "教室", dataIndex: "roomId", key: "roomId" },
    { title: "预定人", dataIndex: "user", key: "user" },
    { title: "时间", dataIndex: "startTime", key: "startTime", render: time => new Date(time).toLocaleString() },
    { title: "状态", dataIndex: "status", key: "status", render: status => status === "approved" ? "✅ 已批准" : status === "pending" ? "⏳ 待审核" : "❌ 已拒绝" },
    {
      title: "操作",
      render: (_, record) => record.status === "pending" && (
        <>
          <Button type="primary" onClick={() => handleApprove(record.id)} style={{ marginRight: 10 }}>批准</Button>
          <Button danger onClick={() => handleReject(record.id)}>拒绝</Button>
        </>
      )
    },
  ];

  return (
    <Card title="所有预定（管理员审核）">
      <ProTable columns={columns} dataSource={bookings} rowKey="id" />
    </Card>
  );
};

export default Admin;
