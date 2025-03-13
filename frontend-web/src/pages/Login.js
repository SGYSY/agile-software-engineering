import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, message } from "antd";

const Login = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    let role = "";
    if (userId === "123") role = "student";
    else if (userId === "456") role = "teacher";
    else if (userId === "789") role = "admin";
    else {
      message.error("Invalid User ID");
      return;
    }

    localStorage.setItem("userRole", role);
    message.success(`Login successful! Role: ${role}`);

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <Card 
        title="DIICSU Room Booking Login" 
        style={{ maxWidth: 400, textAlign: "center", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)" }}
      >
        <Input 
          placeholder="Enter User ID (123 - Student, 456 - Teacher, 789 - Admin)" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          style={{ marginBottom: 10 }}
        />
        <Button type="primary" block onClick={handleLogin}>
          Login
        </Button>
      </Card>
    </div>
  );
};

export default Login;
