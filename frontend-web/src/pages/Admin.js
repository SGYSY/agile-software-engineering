import React, { useState, useEffect } from "react";
import { Button, message, Card, Badge } from "antd";
import ProTable from "@ant-design/pro-table";

// API 基地址
const API_BASE = "http://47.113.186.66:8080/api";

// 获取所有预订
const fetchBookings = async () => {
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    message.error("Failed to fetch booking data");
    return [];
  }
};

// 更新预订状态（批准或拒绝）
const updateBookingStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
    message.error("Failed to update booking status");
  }
};

// 发送通知
const saveNotification = async (userId, messageText) => {
  try {
    const response = await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: { id: userId },
        message: messageText,
        status: "pending",
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to send notification");
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    message.error("Failed to send notification");
  }
};

const Admin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings().then(setBookings);  // 获取预订列表
  }, []);

  const handleApprove = (id) => {
    // 批准预订
    updateBookingStatus(id, "approved");
    const booking = bookings.find((b) => b.id === id);
    saveNotification(booking.user.id, `Your booking for room ${booking.room.name} has been approved.`);  // 发送通知
    message.success("Booking approved!");
    fetchBookings().then(setBookings);  // 刷新预订列表
  };

  const handleReject = (id) => {
    // 拒绝预订
    updateBookingStatus(id, "rejected");
    message.warning("Booking rejected!");
    fetchBookings().then(setBookings);  // 刷新预订列表
  };

  const columns = [
    { 
      title: "Room", 
      dataIndex: "room",  // 修改为 "room"，然后在 render 中获取 room.name 
      key: "room",
      render: (room) => room.name,  // 访问 room 对象的 name 属性
    },
    { 
      title: "Booked By", 
      dataIndex: "user", 
      key: "user", 
      render: (user) => user.firstName + " " + user.lastName,  // 渲染用户的姓名
    },
    { 
      title: "Time", 
      dataIndex: "startTime", 
      key: "startTime", 
      render: (time) => {
        const date = new Date(time);
        return date.toLocaleString();  // 格式化为本地时间
      },
    },
    { 
      title: "Status", 
      dataIndex: "status", 
      key: "status", 
      render: (status) => (
        <Badge
          status={status === "confirmed" ? "success" : status === "pending" ? "warning" : "error"}
          text={status === "confirmed" ? "✅ Approved" : status === "pending" ? "⏳ Pending" : "❌ Rejected"}
        />
      ), 
    },
    {
      title: "Actions",
      render: (_, record) => record.status === "pending" && (
        <>
          <Button type="primary" onClick={() => handleApprove(record.id)} style={{ marginRight: 10 }}>Approve</Button>
          <Button danger onClick={() => handleReject(record.id)}>Reject</Button>
        </>
      ),
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
