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
  const userRole = localStorage.getItem("userRole"); // 获取当前用户角色

  const [room, setRoom] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // 获取当前房间信息
    const allRooms = getRooms();
    const currentRoom = allRooms.find((r) => r.id === roomId);
    setRoom(currentRoom);

    // 获取当前房间的所有未被拒绝的预约（包括 pending 与 approved）
    const roomBookings = getBookings().filter(
      (b) => b.roomId === roomId && b.status !== "rejected"
    );
    setBookings(roomBookings);
  }, [roomId]);

  if (!room) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Room not found</p>;
  }

  // 计算表格数据：对每个时段，每个星期几，整理该单元格的预约信息
  const scheduleData = timeSlots.map((time) => {
    const row = { key: time, time };
    weekdays.forEach((day) => {
      // 找到同一 weekday + timeSlot 的所有预约
      const slotBookings = bookings.filter(
        (b) => b.weekday === day && b.timeSlot === time
      );
      // 判断是否有教师锁定
      const locked = slotBookings.some((b) => b.lock === true);
      // 计算已审批的总人数
      const approvedBookings = slotBookings.filter((b) => b.status === "approved");
      const totalApproved = approvedBookings.reduce((sum, b) => sum + (b.participants || 0), 0);
      // 将所有数据存入 cellData 中
      row[day] = { slotBookings, locked, totalApproved };
    });
    return row;
  });

  // 点击预约标签显示预约详情；只有管理员可查看详情，老师和学生点击则提示无权限
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

  // 点击单元格（空白或未满）则跳转到 Booking 页面，传递日期和时段参数
  const handleCellClick = (cellData, record, day) => {
    if (!cellData) return;

    // 如果有锁定，则提示不可预约
    if (cellData.locked && cellData.slotBookings.length > 0) {
      Modal.info({
        title: "Cannot Book",
        content: "This timeslot has been locked by a teacher."
      });
      return;
    }
    // 如果已有预约且总人数达到房间容量，则提示已满
    if (cellData.slotBookings.length > 0 && cellData.totalApproved >= room.capacity) {
      Modal.info({
        title: "Cannot Book",
        content: "This timeslot is already full."
      });
      return;
    }
    // 否则跳转到 Booking 页面
    const targetDate = getDateOfNextWeekday(day);
    const dateStr = moment(targetDate).format("YYYY-MM-DD");
    navigate(`/booking/${roomId}?date=${dateStr}&timeSlot=${record.time}`);
  };

  // 简单示例：将 weekday 转换为最近的那一天的日期
  const getDateOfNextWeekday = (weekday) => {
    const weekdayMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0
    };
    const targetDay = weekdayMap[weekday];
    const now = moment();
    let currentDay = now.day();
    if (currentDay === targetDay) {
      return now.add(7, "days").toDate();
    } else {
      let diff = targetDay - currentDay;
      if (diff < 0) diff += 7;
      return now.add(diff, "days").toDate();
    }
  };

  // 构建表格列
  const columns = [
    {
      title: "Time Slot",
      dataIndex: "time",
      key: "time",
      width: 120
    },
    ...weekdays.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (cellData, record) => {
        if (!cellData) return null;
        const { slotBookings, locked, totalApproved } = cellData;
        // 如果有预约，则显示每条预约的 Tag
        if (slotBookings.length > 0) {
          return slotBookings.map((booking) => {
            const tagColor = booking.status === "pending" ? "orange" : "blue";
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
          // 没有预约，则显示 "Free" Tag；点击跳转到 Booking 页面
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
      // 同时让整列空白单元格也支持点击预约
      onCell: (record) => ({
        onClick: () => handleCellClick(record[day], record, day)
      })
    }))
  ];

  return (
    <Card title={`Room ${roomId} Schedule`} style={{ padding: 20 }}>
      <Table
        columns={columns}
        dataSource={scheduleData}
        pagination={false}
        bordered
        size="middle"
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
