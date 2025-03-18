import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    const { email, password } = values;

    if (password !== "password123") {
      message.error("Incorrect password.");
      setLoading(false);
      return;
    }

    const lowerEmail = email.toLowerCase();
    let role = "";
    let displayName = "";
    if (lowerEmail === "admin@dundee.ac.uk") {
      role = "admin";
      displayName = "Admin";
    } else if (lowerEmail === "teacher@dundee.ac.uk") {
      role = "teacher";
      displayName = "Teacher";
    } else if (lowerEmail === "2543301@dundee.ac.uk") {
      role = "student";
      displayName = "Siyu Yan";
    } else {
      message.error("Invalid Email or unauthorized user.");
      setLoading(false);
      return;
    }

    localStorage.setItem("userRole", role);
    localStorage.setItem("displayName", displayName);

    message.success(`Login successful! Welcome, ${displayName}`);

    setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/");
      setLoading(false);
    }, 500);
  };

  const validateDundeeEmail = (_, value) => {
    if (!value) return Promise.reject("Please enter your email address");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value))
      return Promise.reject("Please enter a valid email address");

    if (!value.toLowerCase().endsWith("dundee.ac.uk"))
      return Promise.reject("Please enter a valid Dundee email address");

    return Promise.resolve();
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: "url(/login.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 顶部白色背景区域，clipPath 形状调整，让登录框进入白色部分 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%", // 调整白色区域高度
          backgroundColor: "rgba(255,255,255,0.9)",
          clipPath: "ellipse(100% 40% at 50% 20%)", // 让白色部分更靠上
          zIndex: 1,
        }}
      />

      <div
        style={{
          zIndex: 2,
          padding: "40px 30px",
          width: 400,
          marginTop: "10vh", // 让登录框往上移动
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 30, color: "#4161d9" }}>
          DIICSU Room Booking
        </h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{
            background: "rgba(255,255,255,0.9)",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <Form.Item label="Email" name="email" rules={[{ validator: validateDundeeEmail }]}>            
            <Input placeholder="Enter Dundee email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={{ backgroundColor: "#4161d9", borderColor: "#4161d9" }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
