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
    // 这里改成获取 "approved" 和 "pending" 状态的预订
    const roomBookings = getBookings().filter(
      (booking) => booking.roomId === roomId && (booking.status === "approved" || booking.status === "pending")
    );
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
      row[day] = booking ? booking : null; // 直接存完整的 booking 数据
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
          <Tag color={booking.status === "pending" ? "orange" : "blue"} style={{ cursor: "pointer" }} onClick={() => handleBookingClick(booking)}>
            {booking.status === "pending" ? "Pending Approval" : "Booked"}
          </Tag>
        ) : null,
    })),
  ];

  return (
    <Card title={`Room ${roomId} Schedule`} style={{ padding: 20 }}>
      <Table columns={columns} dataSource={scheduleData} pagination={false} bordered size="middle" />
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>Room ID:</strong> {selectedBooking.roomId}</p>
            <p><strong>User:</strong> {selectedBooking.user}</p>
            <p><strong>Start Time:</strong> {selectedBooking.startTime}</p>
            <p><strong>Weekday:</strong> {selectedBooking.weekday}</p>
            <p><strong>Time Slot:</strong> {selectedBooking.timeSlot}</p>
            <p><strong>Participants:</strong> {selectedBooking.participants}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Lock Room:</strong> {selectedBooking.lock ? "Yes" : "No"}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default RoomSchedule;
