import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  DatePicker,
  Select,
  Button,
  message,
  Descriptions,
  InputNumber,
  Checkbox
} from "antd";
import moment from "moment";
import { getRooms, getBookings, saveBooking } from "../utils/demoData";

const { Option } = Select;

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

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === roomId);

  const userRole = localStorage.getItem("userRole");

  // 从 URL 查询参数获取初始 date & timeSlot
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialDate = searchParams.get("date"); // e.g. "2025-03-20"
  const initialTimeSlot = searchParams.get("timeSlot"); // e.g. "08:00 - 08:45"

  // 状态
  const [date, setDate] = useState(initialDate ? moment(initialDate) : null);
  const [timeSlot, setTimeSlot] = useState(initialTimeSlot || null);
  const [participants, setParticipants] = useState(1);
  const [lockRoom, setLockRoom] = useState(false); // 仅教师可用

  if (!room) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Room not found</p>;
  }

  // 如果是学生且不在房间的 allowedRoles 中，则提示无权限
  if (userRole === "student" && !room.allowedRoles.includes("student")) {
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        You do not have permission to book this room.
      </p>
    );
  }

  const handleBooking = () => {
    // 校验
    if (!date || !timeSlot) {
      return message.error("Please select a date and time slot!");
    }
    if (!participants) {
      return message.error("Please input number of participants!");
    }
    if (participants > room.bookingLimit) {
      return message.error(`This room can only be booked for up to ${room.bookingLimit} participant(s) per booking.`);
    }

    const dateStr = date.format("YYYY-MM-DD");

    // 获取已有预约（非 rejected）
    const allBookings = getBookings();
    const existingBookings = allBookings.filter(
      (b) =>
        b.roomId === roomId &&
        b.timeSlot === timeSlot &&
        moment(b.startTime).format("YYYY-MM-DD") === dateStr &&
        b.status !== "rejected"
    );

    // 如果已存在教师锁定
    const lockedBooking = existingBookings.find((b) => b.lock === true);
    if (lockedBooking) {
      return message.error("This time slot has been locked by a teacher. Cannot book.");
    }

    // 计算已审批人数
    const approvedBookings = existingBookings.filter((b) => b.status === "approved");
    const totalApproved = approvedBookings.reduce((sum, b) => sum + (b.participants || 0), 0);
    if (totalApproved + participants > room.capacity) {
      return message.error(`Not enough capacity. Already booked: ${totalApproved} participants.`);
    }

    // 如果已存在 pending 预约，是否允许多条 pending？
    // 这里示例：不允许多条 pending
    const pendingExists = existingBookings.some((b) => b.status === "pending");
    if (pendingExists) {
      return message.error("There is already a pending booking for this time slot.");
    }

    // 通过校验后，保存预约
    const weekday = date.format("dddd");
    const startTime = moment(`${dateStr} ${timeSlot.split(" - ")[0]}`).toISOString();

    const newBooking = {
      id: Date.now().toString(),
      roomId,
      user: userRole,
      startTime,
      weekday,
      timeSlot,
      participants,
      lock: userRole === "teacher" ? lockRoom : false,
      status: "pending"
    };

    saveBooking(newBooking);
    message.success("Booking submitted successfully. Awaiting admin approval!");
    navigate("/my-bookings");
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <Card
        title={`Book Room: ${room.name}`}
        style={{ maxWidth: 500, borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }}
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Capacity">{room.capacity} people</Descriptions.Item>
          <Descriptions.Item label="Equipment">{room.equipment.join(", ")}</Descriptions.Item>
          <Descriptions.Item label="Booking Limit">Up to {room.bookingLimit} participant(s) per booking</Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 20 }}>
          <DatePicker
            value={date}
            onChange={(value) => setDate(value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <Select
            placeholder="Select a time slot"
            onChange={setTimeSlot}
            style={{ width: "100%", marginBottom: 10 }}
            value={timeSlot}
          >
            {timeSlots.map((slot) => (
              <Option key={slot} value={slot}>
                {slot}
              </Option>
            ))}
          </Select>
          <InputNumber
            min={1}
            max={room.bookingLimit}
            value={participants}
            onChange={(value) => setParticipants(value)}
            style={{ width: "100%", marginBottom: 10 }}
            placeholder="Number of Participants"
          />
          {userRole === "teacher" && (
            <Checkbox
              checked={lockRoom}
              onChange={(e) => setLockRoom(e.target.checked)}
              style={{ marginBottom: 20 }}
            >
              Lock Room (prevent others from booking)
            </Checkbox>
          )}
          <Button
            type="primary"
            block
            onClick={handleBooking}
            size="large"
            style={{ borderRadius: "5px" }}
          >
            Submit Booking (Pending Approval)
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Booking;
