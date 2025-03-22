import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, Button } from "antd";
import ReactECharts from "echarts-for-react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const API_BASE = "http://47.113.186.66:8080/api";

const dashboardCardStyle = {
  backgroundColor: "#f0f2f5",
  borderRadius: "10px",
  border: "none",
  padding: "20px"
};

const cardStyle = {
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
};

const titleStyle = {
  color: "#4161d9",
  fontWeight: "bold"
};

const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data || []))
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      });

    fetch(`${API_BASE}/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data || []))
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setRooms([]);
      });
  }, []);

  // -----------------------------
  // Data Processing
  // -----------------------------

  const totalBookings = bookings.length;
  const approvedBookings = bookings.filter(b => b.status === "approved").length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const rejectedBookings = bookings.filter(b => b.status === "rejected").length;

  // 🏫 Classroom Capacity Chart
  const roomCapacityOption = {
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
          itemStyle: { color: ['#4161d9', '#5a7dd9', '#7a98d9'][index % 3] }
        })),
        barWidth: 40,
        itemStyle: {
          borderRadius: [10, 10, 0, 0]
        }
      }
    ]
  };

  // ⏰ Usage Heatmap (by time slot)
  const timeSlots = ['8-10', '10-12', '12-14', '14-16', '16-18', '18-20'];
  const bookingHeat = timeSlots.map(slot => {
    const matchSlot = (time) => time.includes(slot.split("-")[0]);
    return bookings.filter(b => b.time && matchSlot(b.time)).length;
  });

  const timeHeatOption = {
    title: {
      text: 'Usage Heatmap (by Time Slot)',
      left: 'center',
      textStyle: { color: "#4161d9", fontWeight: "bold" }
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: timeSlots,
      axisLine: { lineStyle: { color: "#4161d9" } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: "#4161d9" } }
    },
    series: [
      {
        data: bookingHeat,
        type: 'bar',
        barWidth: 40,
        itemStyle: { color: "#5a7dd9", borderRadius: [10, 10, 0, 0] }
      }
    ]
  };

  // 📊 Classroom Usage Ranking (most bookings)
  const usageMap = {};
  bookings.forEach(b => {
    if (!usageMap[b.roomName]) usageMap[b.roomName] = 0;
    usageMap[b.roomName]++;
  });

  const usageData = Object.entries(usageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 most used classrooms

  const usageRankingOption = {
    title: {
      text: 'Classroom Usage Ranking',
      left: 'center',
      textStyle: { color: "#4161d9", fontWeight: "bold" }
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: usageData.map(item => item[0]),
      axisLabel: { rotate: 30 },
      axisLine: { lineStyle: { color: "#4161d9" } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: "#4161d9" } }
    },
    series: [
      {
        data: usageData.map(item => item[1]),
        type: 'bar',
        barWidth: 40,
        itemStyle: { color: "#7a98d9", borderRadius: [10, 10, 0, 0] }
      }
    ]
  };

  // 🟠 Donut Chart: Booking Status Distribution
  const donutOption = {
    title: {
      text: 'Booking Status Distribution',
      left: 'center',
      textStyle: { color: "#4161d9", fontWeight: "bold" }
    },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: "#4161d9" }
    },
    series: [
      {
        name: 'Booking Count',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: { show: false },
        data: [
          { value: approvedBookings, name: 'Approved' },
          { value: pendingBookings, name: 'Pending' },
          { value: rejectedBookings, name: 'Rejected' }
        ],
        itemStyle: {
          color: function(params) {
            const colorList = ['#4161d9', '#5a7dd9', '#7a98d9'];
            return colorList[params.dataIndex % colorList.length];
          }
        }
      }
    ]
  };

  // Export report to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(bookings);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, "bookings_report.xlsx");
  };

  return (
    <Card title="Admin Dashboard" style={dashboardCardStyle}>
      {/* Export Button */}
      <Button 
        type="primary" 
        onClick={exportToExcel} 
        style={{ position: 'absolute', top: 20, right: 20 }}
      >
        Export Report
      </Button>

      {/* Booking Statistics */}
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title={<span style={titleStyle}>Total Bookings</span>} value={totalBookings} />
        </Col>
        <Col span={6}>
          <Statistic title={<span style={titleStyle}>Approved</span>} value={approvedBookings} valueStyle={{ color: "#3f8600" }} />
        </Col>
        <Col span={6}>
          <Statistic title={<span style={titleStyle}>Pending</span>} value={pendingBookings} valueStyle={{ color: "#faad14" }} />
        </Col>
        <Col span={6}>
          <Statistic title={<span style={titleStyle}>Rejected</span>} value={rejectedBookings} valueStyle={{ color: "#cf1322" }} />
        </Col>
      </Row>

      {/* Chart Display Section */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Booking Status Donut Chart" style={cardStyle}>
            <ReactECharts option={donutOption} style={{ height: '400px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Classroom Capacity Chart" style={cardStyle}>
            <ReactECharts option={roomCapacityOption} style={{ height: '400px' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Usage Heatmap (by Time Slot)" style={cardStyle}>
            <ReactECharts option={timeHeatOption} style={{ height: '400px' }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Classroom Usage Ranking" style={cardStyle}>
            <ReactECharts option={usageRankingOption} style={{ height: '400px' }} />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default AdminDashboard;
