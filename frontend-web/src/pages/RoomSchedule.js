import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Modal, Tag, Card } from "antd";
import moment from "moment";
import { getRooms, getBookings } from "../utils/demoData";

// 固定时间段
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

// 星期数组
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RoomSchedule = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const [room, setRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const allRooms = getRooms();
    const currentRoom = allRooms.find((r) => r.id === roomId);
    setRoom(currentRoom);

    const roomBookings = getBookings().filter(
      (b) => b.roomId === roomId && b.status !== "rejected"
    );
    setBookings(roomBookings);
  }, [roomId]);

  if (!room) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Room not found</p>;
  }

  // 构造表格数据
  const scheduleData = timeSlots.map((time) => {
    const row = { key: time, time };
    weekdays.forEach((day) => {
      const slotBookings = bookings.filter(
        (b) => b.weekday === day && b.timeSlot === time
      );
      const locked = slotBookings.some((b) => b.lock === true);
      const approvedBookings = slotBookings.filter((b) => b.status === "approved");
      const totalApproved = approvedBookings.reduce((sum, b) => sum + (b.participants || 0), 0);
      row[day] = { slotBookings, locked, totalApproved };
    });
    return row;
  });

  const handleBookingClick = (booking) => {
    if (userRole !== "admin") {
      Modal.info({
        title: "No Permission",
        content: "You do not have permission to view booking details."
      });
      return;
    }
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleCellClick = (cellData, record, day) => {
    if (!cellData) return;
    if (cellData.locked && cellData.slotBookings.length > 0) {
      Modal.info({
        title: "Cannot Book",
        content: "This timeslot has been locked by a teacher."
      });
      return;
    }
    if (cellData.slotBookings.length > 0 && cellData.totalApproved >= room.capacity) {
      Modal.info({
        title: "Cannot Book",
        content: "This timeslot is already full."
      });
      return;
    }
    const targetDate = getDateOfNextWeekday(day);
    const dateStr = moment(targetDate).format("YYYY-MM-DD");
    navigate(`/booking/${roomId}?date=${dateStr}&timeSlot=${record.time}`);
  };

  const getDateOfNextWeekday = (weekday) => {
    const weekdayMap = {
      Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4,
      Friday: 5, Saturday: 6, Sunday: 0
    };
    const targetDay = weekdayMap[weekday];
    const now = moment();
    let diff = targetDay - now.day();
    if (diff < 0) diff += 7;
    return now.add(diff, "days").toDate();
  };

  const columns = [
    {
      title: "Time Slot",
      dataIndex: "time",
      key: "time",
      width: 120,
      fixed: "left",
      render: (text) => <span style={{ fontWeight: "bold", color: "#165DFF" }}>{text}</span>,
    },
    ...weekdays.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (cellData, record) => {
        if (!cellData) return null;
        const { slotBookings } = cellData;
        if (slotBookings.length > 0) {
          return slotBookings.map((booking) => {
            const tagColor = booking.status === "pending" ? "orange" : "blue"; // 颜色保持原来的
            const tagText = booking.status === "pending" ? "Pending Approval" : "Booked";
            return (
              <Tag
                key={booking.id}
                color={tagColor}
                style={{ cursor: "pointer", display: "block", marginBottom: 4 }}
                onClick={() => handleBookingClick(booking)}
              >
                {tagText}
              </Tag>
            );
          });
        } else {
          return (
            <Tag
              color="green"
              style={{ cursor: "pointer" }}
              onClick={() => handleCellClick(cellData, record, day)}
            >
              Free
            </Tag>
          );
        }
      },
      onCell: (record) => ({
        onClick: () => handleCellClick(record[day], record, day)
      }),
    }))
  ];

  return (
    <Card 
      title={`Room ${roomId} Schedule`} 
      style={{ 
        padding: 20, 
        background: "#FFFFFF",
        border: "1px solid #E6E6E6",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
      }}
      headStyle={{ background: "#E8F3FF", color: "#165DFF", fontWeight: "bold" }}
    >
      <Table
        columns={columns}
        dataSource={scheduleData}
        pagination={false}
        bordered
        size="middle"
        style={{ borderRadius: 8 }}
      />
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedBooking && (
          <div>
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>User:</strong> {selectedBooking.user}</p>
            <p><strong>Weekday:</strong> {selectedBooking.weekday}</p>
            <p><strong>Time Slot:</strong> {selectedBooking.timeSlot}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default RoomSchedule;
