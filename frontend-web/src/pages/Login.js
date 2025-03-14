import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message } from "antd";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    const { email, password } = values;

    // 假密码验证
    if (password !== "password123") {
      message.error("Incorrect password.");
      setLoading(false);
      return;
    }

    const lowerEmail = email.toLowerCase();

    // 根据邮箱映射角色及显示名称
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
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      setLoading(false);
    }, 500);
  };

  // 自定义验证函数：统一校验必填、格式和后缀
  const validateDundeeEmail = (_, value) => {
    if (!value) {
      return Promise.reject("Please enter your email address");
    }
    // 简易邮箱格式检测
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject("Please enter a valid email address");
    }
    // 后缀判断
    if (!value.toLowerCase().endsWith("dundee.ac.uk")) {
      return Promise.reject("Please enter a valid Dundee email address");
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url(/login.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        title="DIICSU Room Booking Login"
        style={{
          maxWidth: 400,
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
          borderRadius: 8,
        }}
      >
        <Form layout="vertical" onFinish={onFinish} initialValues={{ email: "", password: "" }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ validator: validateDundeeEmail }]}
          >
            <Input placeholder="Enter Email (must be Dundee email)" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter Password (e.g. password123)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
