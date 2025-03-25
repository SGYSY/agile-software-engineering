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
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // 当前周次，默认当前 ISO 周数
  const [currentWeek, setCurrentWeek] = useState(moment().isoWeek());

  useEffect(() => {
    // 调用 API 获取指定房间的课程安排
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`http://47.113.186.66:8080/api/schedules/room/${roomId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Schedules data:", data);
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        message.error("获取课程安排失败");
      }
    };

    fetchSchedules();
  }, [roomId]);

  // 如果接口返回数据不为空，从第一个 schedule 中获取房间信息，否则使用 roomId 作为默认信息
  const roomInfo = schedules.length > 0 ? schedules[0].room : { id: roomId, name: `Room ${roomId}` };

  // 构造课表数据：每个时间段为一行，每个星期为一列，只显示当前周的记录
  const scheduleData = timeSlots.map((slot, index) => {
    const period = index + 1; // 对应 schedule.period
    const row = { key: slot, time: slot };
    weekdays.forEach((day) => {
      const dayNumber = weekdayMap[day];
      // 筛选出当前周、该时间段、该星期的记录（若有重复，只取第一条）
      const cellSchedules = schedules.filter(
        (s) => s.period === period && s.weekday === dayNumber && s.weekNumber === currentWeek
      );
      row[day] = cellSchedules.length > 0 ? [cellSchedules[0]] : [];
    });
    return row;
  });

  const handleScheduleClick = (schedule) => {
    if (userRole !== "admin") {
      Modal.info({
        title: "No Permission",
        content: "You do not have permission to view schedule details.",
      });
      return;
    }
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
  };

  const handleCellClick = (cellData, record, day) => {
    // 如果单元格为空，则允许预订
    if (!cellData || cellData.length === 0) {
      const targetDate = getDateOfNextWeekday(day);
      const dateStr = moment(targetDate).format("YYYY-MM-DD");
      navigate(`/booking/${roomId}?date=${dateStr}&timeSlot=${record.time}`);
    }
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
              onClick={() => handleCellClick(cellData, record, day)}
            >
              Free
            </Tag>
          );
        } else {
          const schedule = cellData[0];
          return (
            <Tag
              key={schedule.id}
              color="blue"
              style={{ cursor: "pointer", display: "block", marginBottom: 4 }}
              onClick={() => handleScheduleClick(schedule)}
            >
              {schedule.courseName}
            </Tag>
          );
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
        title="Schedule Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {selectedSchedule && (
          <div>
            <p><strong>Course:</strong> {selectedSchedule.courseName}</p>
            <p><strong>Instructor:</strong> {selectedSchedule.instructor}</p>
            <p><strong>Group:</strong> {selectedSchedule.groupId}</p>
            <p>
              <strong>Time:</strong> {selectedSchedule.startTime} - {selectedSchedule.endTime}
            </p>
            <p><strong>Week Number:</strong> {selectedSchedule.weekNumber}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default RoomSchedule;
