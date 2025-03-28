import React, { useRef } from "react";
import { Button, message, Card, Badge, Typography, Popconfirm } from "antd";
import ProTable from "@ant-design/pro-table";

const { Title } = Typography;
const API_BASE = "http://47.113.186.66:8080/api";

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
  const actionRef = useRef();

  const handleApprove = async (record) => {
    await updateBookingStatus(record.id, "approved");
    await saveNotification(record.user.id, `Your booking for room ${record.room.name} has been approved.`);
    message.success("Booking approved!");
    actionRef.current?.reload();
  };

  const handleReject = async (record) => {
    await updateBookingStatus(record.id, "rejected");
    message.warning("Booking rejected!");
    actionRef.current?.reload();
  };

  const handleDelete = async (id) => {
    await deleteBooking(id);
    message.success("Booking deleted!");
    actionRef.current?.reload();
  };

  const columns = [
    {
      title: "Room Name",
      dataIndex: "roomName",
      valueType: "text",
      hideInTable: true,
    },
    {
      title: "Week Number",
      dataIndex: "weekNumber",
      valueType: "digit",
      hideInTable: true,
    },
    {
      title: "Day of Week",
      dataIndex: "dayOfWeek",
      valueType: "select",
      valueEnum: {
        1: { text: "Monday" },
        2: { text: "Tuesday" },
        3: { text: "Wednesday" },
        4: { text: "Thursday" },
        5: { text: "Friday" },
        6: { text: "Saturday" },
        7: { text: "Sunday" },
      },
      hideInTable: true,
    },
    {
      title: "Start Block",
      dataIndex: "timeSlotStart",
      valueType: "digit",
      hideInTable: true,
    },
    {
      title: "End Block",
      dataIndex: "timeSlotEnd",
      valueType: "digit",
      hideInTable: true,
    },
    {
      title: "Start Time After",
      dataIndex: "startTimeAfter",
      valueType: "time",
      hideInTable: true,
    },
    {
      title: "End Time Before",
      dataIndex: "endTimeBefore",
      valueType: "time",
      hideInTable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        pending: { text: "Pending" },
        confirmed: { text: "Confirmed" },
        rejected: { text: "Rejected" },
      },
      hideInTable: true,
    },
    {
      title: "Room",
      dataIndex: ["room", "name"],
      hideInSearch: true,
    },
    {
      title: "Booked By",
      dataIndex: "user",
      render: (user) => `${user.firstName} ${user.lastName}`,
      hideInSearch: true,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (time) =>
        new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      hideInSearch: true,
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (time) =>
        new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      hideInSearch: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Badge
          status={
            status === "confirmed"
              ? "success"
              : status === "pending"
              ? "warning"
              : "error"
          }
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
      hideInSearch: true,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {record.status === "pending" && (
            <>
              <Button type="primary" onClick={() => handleApprove(record)}>
                Approve
              </Button>
              <Button onClick={() => handleReject(record)}>Reject</Button>
            </>
          )}
          <Popconfirm
            title="Confirm delete?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
      hideInSearch: true,
    },
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
          actionRef={actionRef}
          rowKey="id"
          request={async (params) => {
            const searchParams = new URLSearchParams();
            for (const key in params) {
              if (params[key] !== undefined && params[key] !== "") {
                searchParams.append(key, params[key]);
              }
            }
            try {
              const response = await fetch(`${API_BASE}/bookings/search?${searchParams.toString()}`);
              if (!response.ok) throw new Error("Fetch failed");
              const data = await response.json();
              return { data, success: true };
            } catch (err) {
              message.error("Failed to load booking data");
              return { data: [], success: false };
            }
          }}
          search={{ labelWidth: "auto" }}
          pagination={{ pageSize: 6 }}
          toolBarRender={false}
        />
      </Card>
    </div>
  );
};

export default Admin;
