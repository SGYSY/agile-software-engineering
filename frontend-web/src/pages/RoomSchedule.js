import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Modal, Tag, Card, Button, message } from "antd";
import moment from "moment";

// 固定时间段（对应 schedule 的 period 字段，假设 period 从 1 开始）
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

// 星期数组与对应的数字（API 返回 weekday：1=Monday,...,7=Sunday）
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const weekdayMap = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const RoomSchedule = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 当前周次，默认当前 ISO 周数
  const [currentWeek, setCurrentWeek] = useState(moment().isoWeek());

  // 获取 schedule 数据
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`http://47.113.186.66:8080/api/schedules/room/${roomId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        message.error("获取课程安排失败");
      }
    };

    fetchSchedules();
  }, [roomId]);

  // 获取 booking 数据
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://47.113.186.66:8080/api/bookings/room/${roomId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        message.error("获取预定信息失败");
      }
    };

    fetchBookings();
  }, [roomId]);

  // 如果接口返回数据不为空，从第一个 schedule 中获取房间信息，否则使用 roomId 作为默认信息
  const roomInfo = schedules.length > 0 ? schedules[0].room : { id: roomId, name: `Room ${roomId}` };

  // 辅助函数：判断 booking 是否与时间段重叠
  const isBookingInTimeSlot = (slot, booking) => {
    const [slotStartStr, slotEndStr] = slot.split(" - ");
    const slotStart = moment(slotStartStr, "HH:mm");
    const slotEnd = moment(slotEndStr, "HH:mm");
    const bookingStart = moment(booking.startTime, "HH:mm:ss");
    const bookingEnd = moment(booking.endTime, "HH:mm:ss");
    return bookingStart.isBefore(slotEnd) && bookingEnd.isAfter(slotStart);
  };

  // 构造课表数据：每个时间段为一行，每个星期为一列，只显示当前周的记录
  // 同时合并 schedule 与 booking 数据
  const scheduleData = timeSlots.map((slot, index) => {
    const period = index + 1; // 对应 schedule.period
    const row = { key: slot, time: slot };
    weekdays.forEach((day) => {
      const dayNumber = weekdayMap[day];
      // 筛选 schedule 数据
      const cellSchedules = schedules.filter(
        (s) => s.period === period && s.weekday === dayNumber && s.weekNumber === currentWeek
      );
      // 筛选 booking 数据（判断 dayOfWeek、weekNumber 以及时间段重叠）
      const cellBookings = bookings.filter(
        (b) => b.dayOfWeek === dayNumber && b.weekNumber === currentWeek && isBookingInTimeSlot(slot, b)
      );
      // 合并数据
      row[day] = [...cellSchedules, ...cellBookings];
    });
    return row;
  });

  // 通用点击事件，根据 item 类型显示详情
  const handleItemClick = (item) => {
    if (userRole !== "admin") {
      Modal.info({
        title: "No Permission",
        content: "You do not have permission to view details.",
      });
      return;
    }
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  // 当单元格为空时，点击跳转到预定页面
  const handleCellClick = (record, day) => {
    navigateToBooking(record, day);
  };

  const navigateToBooking = (record, day) => {
    const targetDate = getDateOfNextWeekday(day);
    const dateStr = moment(targetDate).format("YYYY-MM-DD");
    navigate(`/booking/${roomId}?date=${dateStr}&timeSlot=${record.time}`);
  };

  // 计算下一个指定星期的日期
  const getDateOfNextWeekday = (weekday) => {
    const targetDay = weekdayMap[weekday];
    const now = moment();
    let diff = targetDay - now.isoWeekday();
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
        if (!cellData || cellData.length === 0) {
          return (
            <Tag
              color="green"
              style={{ cursor: "pointer" }}
              onClick={() => handleCellClick(record, day)}
            >
              Free
            </Tag>
          );
        } else {
          return cellData.map((item) => {
            // 根据对象字段判断数据类型：courseName => schedule，status => booking
            if (item.courseName) {
              return (
                <Tag
                  key={item.id}
                  color="blue"
                  style={{ cursor: "pointer", display: "block", marginBottom: 4 }}
                  onClick={() => handleItemClick(item)}
                >
                  {item.courseName}
                </Tag>
              );
            } else if (item.status) {
              // 你可以根据 status 设置不同颜色，例如 pending 与 confirmed 分别显示不同颜色
              const tagColor = "orange";
              return (
                <Tag
                  key={item.id}
                  color={tagColor}
                  style={{ cursor: "pointer", display: "block", marginBottom: 4 }}
                  onClick={() => handleItemClick(item)}
                >
                  {`Booking (${item.status})`}
                </Tag>
              );
            }
            return null;
          });
        }
      },
    })),
  ];

  return (
    <Card
      title={`Schedule for ${roomInfo.name} - Week ${currentWeek}`}
      style={{
        padding: 20,
        background: "#FFFFFF",
        border: "1px solid #E6E6E6",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      headStyle={{ background: "#E8F3FF", color: "#165DFF", fontWeight: "bold" }}
    >
      {/* 周次切换控件 */}
      <div style={{ marginBottom: 20, textAlign: "center" }}>
        <Button onClick={() => setCurrentWeek(currentWeek - 1)} style={{ marginRight: 10 }}>
          Previous Week
        </Button>
        <span style={{ fontWeight: "bold" }}>Week {currentWeek}</span>
        <Button onClick={() => setCurrentWeek(currentWeek + 1)} style={{ marginLeft: 10 }}>
          Next Week
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={scheduleData}
        pagination={false}
        bordered
        size="middle"
        style={{ borderRadius: 8 }}
      />
      <Modal
        title="Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedItem && selectedItem.courseName ? (
          <div>
            <p><strong>Course:</strong> {selectedItem.courseName}</p>
            <p><strong>Instructor:</strong> {selectedItem.instructor}</p>
            <p><strong>Group:</strong> {selectedItem.groupId}</p>
            <p>
              <strong>Time:</strong> {selectedItem.startTime} - {selectedItem.endTime}
            </p>
            <p><strong>Week Number:</strong> {selectedItem.weekNumber}</p>
          </div>
        ) : selectedItem && selectedItem.status ? (
          <div>
            <p><strong>User:</strong> {selectedItem.user.username}</p>
            <p><strong>Status:</strong> {selectedItem.status}</p>
            <p>
              <strong>Time:</strong> {selectedItem.startTime} - {selectedItem.endTime}
            </p>
            <p><strong>Week Number:</strong> {selectedItem.weekNumber}</p>
            <p><strong>Day:</strong> {weekdays[selectedItem.dayOfWeek - 1]}</p>
          </div>
        ) : null}
      </Modal>
    </Card>
  );
};

export default RoomSchedule;
