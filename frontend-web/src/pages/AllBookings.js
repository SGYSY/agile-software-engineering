import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookings");
      setBookings(response.data);
    } catch (error) {
      message.error("获取预定失败");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      message.success("预定已取消");
      fetchBookings();
    } catch (error) {
      message.error("取消失败");
    }
  };

  const columns = [
    { title: "教室", dataIndex: "roomId", key: "roomId" },
    { title: "时间", dataIndex: "startTime", key: "startTime", render: time => new Date(time).toLocaleString() },
    { title: "预定人", dataIndex: "userId", key: "userId" },
    { title: "操作", render: (_, record) => (
        <Button danger onClick={() => cancelBooking(record.id)}>取消预定</Button>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>所有预定</h1>
      <Table columns={columns} dataSource={bookings} rowKey="id" />
    </div>
  );
};

export default AllBookings;
