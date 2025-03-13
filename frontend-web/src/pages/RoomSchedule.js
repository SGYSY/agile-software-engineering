import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Table, Modal, Tag, Card } from "antd";
import { getBookings } from "../utils/demoData";

const timeSlots = [
  "08:00 - 08:45",
  "08:55 - 09:40",
  "10:00 - 10:45",
  "10:55 - 11:40",
  "14:00 - 14:45",
  "14:55 - 15:40",
  "16:00 - 16:45",
  "16:55 - 17:40",
  "19:00 - 19:45",
  "19:55 - 20:40",
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RoomSchedule = () => {
  const { roomId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // 这里只显示已批准的预定
    const roomBookings = getBookings().filter(booking => booking.roomId === roomId && booking.status === "approved");
    setBookings(roomBookings);
  }, [roomId]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const scheduleData = timeSlots.map((time) => {
    const row = { key: time, time };

    weekdays.forEach((day) => {
      const booking = bookings.find((b) => b.weekday === day && b.timeSlot === time);
      row[day] = booking
        ? { text: booking.courseName || "Booked", teacher: booking.teacher || "", location: booking.location || "", color: booking.color || "blue" }
        : null;
    });

    return row;
  });

  const columns = [
    { title: "Time Slot", dataIndex: "time", key: "time", width: 120 },
    ...weekdays.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (booking) =>
        booking ? (
          <Tag color={booking.color} style={{ cursor: "pointer" }} onClick={() => handleBookingClick(booking)}>
            {booking.text}
          </Tag>
        ) : null,
    })),
  ];

  return (
    <Card title={`Room ${roomId} Schedule`} style={{ padding: 20 }}>
      <Table columns={columns} dataSource={scheduleData} pagination={false} bordered size="middle" />
      <Modal title={selectedBooking?.text} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        {selectedBooking && <p><strong>Teacher:</strong> {selectedBooking.teacher}</p>}
      </Modal>
    </Card>
  );
};

export default RoomSchedule;
