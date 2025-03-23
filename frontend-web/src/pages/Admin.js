import React, { useState, useEffect } from "react";
import { Button, message, Card, Badge, Typography, Popconfirm } from "antd";
import ProTable from "@ant-design/pro-table";

const { Title } = Typography;
const API_BASE = "http://47.113.186.66:8080/api";

const fetchBookings = async () => {
  try {
    const response = await fetch(`${API_BASE}/bookings`);
    if (!response.ok) throw new Error("Network error");
    return await response.json();
  } catch (error) {
    message.error("Failed to fetch bookings");
    return [];
  }
};

const updateBookingStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Status update failed");
  } catch (error) {
    message.error("Failed to update status");
  }
};

const deleteBooking = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Delete failed");
  } catch (error) {
    message.error("Failed to delete booking");
  }
};

const saveNotification = async (userId, messageText) => {
  try {
    await fetch(`${API_BASE}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { id: userId },
        message: messageText,
        status: "pending",
      }),
    });
  } catch {
    message.error("Failed to send notification");
  }
};

const Admin = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings().then(setBookings);
  }, []);

  const refresh = () => fetchBookings().then(setBookings);

  const handleApprove = async (id) => {
    const booking = bookings.find(b => b.id === id);
    await updateBookingStatus(id, "approved");
    await saveNotification(booking.user.id, `Your booking for room ${booking.room.name} has been approved.`);
    message.success("Booking approved!");
    refresh();
  };

  const handleReject = async (id) => {
    await updateBookingStatus(id, "rejected");
    message.warning("Booking rejected!");
    refresh();
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    message.success("Booking deleted!");
    refresh();
  };

  const handleEdit = (record) => {
    message.info(`Edit booking ${record.id} - implement modal or route.`);
  };

  const columns = [
    {
      title: "Room",
      dataIndex: ["room", "name"],
      key: "room"
    },
    {
      title: "Booked By",
      dataIndex: "user",
      key: "user",
      render: (user) => `${user.firstName} ${user.lastName}`
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          status={status === "confirmed" ? "success" : status === "pending" ? "warning" : "error"}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      )
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {record.status === "pending" && (
            <>
              <Button type="primary" onClick={() => handleApprove(record.id)}>Approve</Button>
              <Button onClick={() => handleReject(record.id)}>Reject</Button>
            </>
          )}
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Confirm delete?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: "40px", background: "#eef1f7", minHeight: "100vh" }}>
      <Title level={2} style={{ color: "#4161d9", marginBottom: 24 }}>Booking Approvals</Title>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          padding: 24,
          background: "#ffffff"
        }}
      >
        <ProTable
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          search={{ labelWidth: "auto" }}
          pagination={{ pageSize: 6 }}
          toolBarRender={false}
        />
      </Card>
    </div>
  );
};

export default Admin;