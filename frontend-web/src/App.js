import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import AdminSchedule from "./pages/AdminSchedule";
import Login from "./pages/Login";
import MainLayout from "./components/Layout";

const PrivateRoute = ({ element, roles }) => {
  const userRole = localStorage.getItem("userRole");
  if (!userRole) return <Navigate to="/login" />;
  if (roles && !roles.includes(userRole)) return <Navigate to="/" />;
  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="booking/:roomId" element={<Booking />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="admin" element={<PrivateRoute element={<Admin />} roles={["admin"]} />} />
          <Route path="admin/bookings" element={<PrivateRoute element={<AdminSchedule />} roles={["admin"]} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
