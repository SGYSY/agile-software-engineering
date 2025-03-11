import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Typography, Card } from "antd";
import axios from "axios";

const { Title } = Typography;
const { confirm } = Modal;

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/bookings");
      setBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
    }
    setLoading(false);
  };

  const cancelBooking = async (id) => {
    confirm({
      title: "Are you sure you want to cancel this booking?",
      content: "This action cannot be undone.",
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/bookings/${id}`);
          message.success("Booking canceled successfully");
          fetchBookings();
        } catch (error) {
          message.error("Failed to cancel booking");
        }
      },
    });
  };

  const columns = [
    { title: "Room", dataIndex: "roomId", key: "roomId", width: 150 },
    { 
      title: "Time", 
      dataIndex: "startTime", 
      key: "startTime", 
      render: time => new Date(time).toLocaleString(), 
      width: 250 
    },
    { title: "Booked By", dataIndex: "userId", key: "userId", width: 150 },
    { 
      title: "Actions", 
      key: "actions", 
      render: (_, record) => (
        <Button danger onClick={() => cancelBooking(record.id)}>Cancel Booking</Button>
      ), 
      width: 200 
    }
  ];

  return (
    <div style={{ padding: 20, background: "#f5f5f5", minHeight: "100vh" }}>
      <Card 
        style={{ borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
      >
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          All Bookings
        </Title>
        <Table 
          columns={columns} 
          dataSource={bookings} 
          rowKey="id" 
          loading={loading} 
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
};

export default AllBookings;
