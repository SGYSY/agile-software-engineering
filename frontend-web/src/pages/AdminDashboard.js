import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Button } from "antd";
import ReactECharts from "echarts-for-react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { DashboardOutlined } from "@ant-design/icons"; // Importing the Dashboard Icon

const API_BASE = "http://47.113.186.66:8080/api";
const COLOR_LIST = ['#4161d9', '#5a7dd9', '#7a98d9', '#9bb3d9', '#bbcdeb'];

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/bookings`).then(res => res.json()).then(setBookings).catch(() => setBookings([]));
    fetch(`${API_BASE}/rooms`).then(res => res.json()).then(setRooms).catch(() => setRooms([]));
  }, []);

  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.status === "confirmed").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const rejectedBookings = bookings.filter(b => b.status === "rejected").length;

  const capacityChartOption = {
    title: {
      text: 'Classroom Capacity Distribution',
      left: 'center',
      textStyle: { color: "#4161d9", fontWeight: "bold" }
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: rooms.map(r => r.name),
      axisLabel: { rotate: 30 },
      axisLine: { lineStyle: { color: "#4161d9" } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: "#4161d9" } }
    },
    series: [
      {
        name: 'Capacity',
        type: 'bar',
        data: rooms.map((r, index) => ({
          value: r.capacity,
          itemStyle: { color: COLOR_LIST[index % COLOR_LIST.length] }
        })),
        barWidth: 40,
        itemStyle: {
          borderRadius: [10, 10, 0, 0]
        }
      }
    ]
  };

  const timeSlots = [
    "08:00 - 08:45", "08:55 - 09:40", "10:00 - 10:45",
    "10:55 - 11:40", "14:00 - 14:45", "14:55 - 15:40",
    "16:00 - 16:45", "16:55 - 17:40", "19:00 - 19:45", "19:55 - 20:40"
  ];
  const formatTime = (start, end) => `${start?.slice(0, 5)} - ${end?.slice(0, 5)}`;
  const bookingHeat = timeSlots.map(slot =>
    bookings.filter(b => formatTime(b.startTime, b.endTime) === slot).length
  );
  const usageLineOption = {
    title: {
      text: "Classroom Usage (Line Chart)",
      left: 'center',
      textStyle: { color: "#4161d9", fontWeight: "bold" }
    },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: timeSlots },
    yAxis: { type: 'value' },
    series: [{
      data: bookingHeat,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: "#4161d9", width: 3 },
      itemStyle: { color: "#5a7dd9" },
      areaStyle: { color: "#dce3f7" }
    }]
  };

  const usageMap = {};
  bookings.forEach(b => {
    const name = b.room?.roomName || "Unknown";
    if (!usageMap[name]) usageMap[name] = 0;
    usageMap[name]++;
  });
  const top5 = Object.entries(usageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const usageDonutOption = {
    title: {
      text: "Top 5 Hot Classrooms",
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        color: "#4161d9",
        fontWeight: "bold"
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} times ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: { color: '#4161d9' },
      data: top5.map(item => item[0])
    },
    series: [
      {
        name: 'Usage Count',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: { show: true },
        data: top5.map((item, index) => ({
          name: item[0],
          value: item[1],
          itemStyle: { color: COLOR_LIST[index % COLOR_LIST.length] }
        }))
      }
    ]
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookings);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
    });
    FileSaver.saveAs(data, "bookings_report.xlsx");
  };

  return (
    <Card
      title={<><DashboardOutlined style={{ marginRight: 8 }} /> Admin Dashboard</>} 
      style={{
        backgroundColor: "#f0f2f5",
        borderRadius: "10px",
        padding: "20px",
        fontFamily: "Segoe UI, sans-serif", // Set the font family here
      }}
    >
      <Button
        type="primary"
        onClick={exportToExcel}
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        Export Report
      </Button>

      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Total Bookings" value={totalBookings} />
        </Col>
        <Col span={6}>
          <Statistic
            title="Approved"
            value={approvedBookings}
            valueStyle={{ color: "#3f8600" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Pending"
            value={pendingBookings}
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Rejected"
            value={rejectedBookings}
            valueStyle={{ color: "#cf1322" }}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Classroom Capacity Chart">
            <ReactECharts option={capacityChartOption} style={{ height: "400px" }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Usage Trend (Line Chart)">
            <ReactECharts option={usageLineOption} style={{ height: "400px" }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 5 Hot Classrooms (Doughnut Chart)">
            <ReactECharts option={usageDonutOption} style={{ height: "400px" }} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default AdminDashboard;
