import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd"; // 引入 Ant Design 语言配置
import enUS from "antd/es/locale/en_US"; // 设定为英文
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import AdminSchedule from "./pages/AdminSchedule";
import RoomSchedule from "./pages/RoomSchedule";  
import Login from "./pages/Login";
import DaySchedule from "./pages/DaySchedule";

// 新增 RoomIssue 页面
import RoomIssue from "./pages/RoomIssue";

// 新增的管理员页面
import AdminUsers from "./pages/AdminUsers";
import AdminHistory from "./pages/AdminHistory";
import AdminRooms from "./pages/AdminRooms";
import AdminDashboard from "./pages/AdminDashboard";
import MainLayout from "./components/Layout";

// PrivateRoute：判断登录状态和角色
const PrivateRoute = ({ element, roles }) => {
  const userRole = localStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(userRole)) return <Navigate to="/" replace />;
  return element;
};

// ProtectedLayout：保证用户已登录后进入主布局
const ProtectedLayout = () => {
  const userRole = localStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/login" replace />;
  return <MainLayout />;
};

function App() {
  return (
    <ConfigProvider locale={enUS}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={<ProtectedLayout />}>
            <Route index element={<Home />} />
            <Route path="booking/:roomId" element={<Booking />} />
            {/* 新增 RoomIssue 路由 */}
            <Route path="roomissue/:roomId" element={<RoomIssue />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="room/:roomId" element={<RoomSchedule />} />

            {/* 管理员页面 */}
            <Route path="admin" element={<PrivateRoute element={<Admin />} roles={["admin"]} />} />
            <Route path="admin/day-schedule/:date" element={<PrivateRoute element={<DaySchedule />} roles={["admin"]} />} />
            <Route path="admin/bookings" element={<PrivateRoute element={<AdminSchedule />} roles={["admin"]} />} />
            <Route path="admin/users" element={<PrivateRoute element={<AdminUsers />} roles={["admin"]} />} />
            <Route path="admin/history" element={<PrivateRoute element={<AdminHistory />} roles={["admin"]} />} />
            <Route path="admin/rooms" element={<PrivateRoute element={<AdminRooms />} roles={["admin"]} />} />
            <Route path="admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} roles={["admin"]} />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
