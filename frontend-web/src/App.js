import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd"; // ✅ 引入 Ant Design 语言配置
import enUS from "antd/es/locale/en_US"; // ✅ 设定为英文
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import AdminSchedule from "./pages/AdminSchedule";
import RoomSchedule from "./pages/RoomSchedule";  
import Login from "./pages/Login";
import DaySchedule from "./pages/DaySchedule";
import MainLayout from "./components/Layout";


const PrivateRoute = ({ element, roles }) => {
  const userRole = localStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(userRole)) return <Navigate to="/" replace />;
  return element;
};

const ProtectedLayout = () => {
  const userRole = localStorage.getItem("userRole");
  
  if (!userRole) return <Navigate to="/login" replace />;

  return <MainLayout />;
};

function App() {
  return (
    <ConfigProvider locale={enUS}>  {/* ✅ 全局设置语言为英文 */}
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={<ProtectedLayout />}>
            <Route index element={<Home />} />
            <Route path="booking/:roomId" element={<Booking />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="room/:roomId" element={<RoomSchedule />} />  
            <Route path="admin" element={<PrivateRoute element={<Admin />} roles={["admin"]} />} />
            <Route path="admin/day-schedule/:date" element={<DaySchedule />} />
            <Route path="admin/bookings" element={<PrivateRoute element={<AdminSchedule />} roles={["admin"]} />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
