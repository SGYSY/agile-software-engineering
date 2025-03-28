import React, { useState, useEffect } from "react";
import { Table, Card, Tag } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";
import { getBookings, getRooms } from "../utils/demoData";

// 固定的时间段
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

const DaySchedule = () => {
  const { date } = useParams();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const approvedBookings = getBookings().filter(b => b.status === "approved");
    const dayBookings = approvedBookings.filter(b => moment(b.startTime).format("YYYY-MM-DD") === date);
    setBookings(dayBookings);

    const roomsData = getRooms();
    setRooms(roomsData);
  }, [date]);

  const columns = [
    {
      title: "Time Slot",
      dataIndex: "timeSlot",
      key: "timeSlot",
      width: 120
    },
    ...rooms.map(room => ({
      title: room.name,
      dataIndex: room.id,
      key: room.id,
      render: (booking) =>
        booking ? (
          <Tag color={booking.color || "blue"}>
            {booking.courseName || "Booked"}
          </Tag>
        ) : null,
    }))
  ];

  const dataSource = timeSlots.map(slot => {
    const row = { key: slot, timeSlot: slot };
    rooms.forEach(room => {
      const booking = bookings.find(b => b.roomId === room.id && b.timeSlot === slot);
      row[room.id] = booking;
    });
    return row;
  });

  return (
    <Card title={`Schedule for ${date}`} style={{ margin: "20px" }}>
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
    </Card>
  );
};

export default DaySchedule;
