import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Tabs } from "antd";
import axios from "axios";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password");
  const navigate = useNavigate();
  const [form] = Form.useForm();


  const onFinish = async (values) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const response = await axios.post("http://47.113.186.66:8080/api/auth/login", {
        username: email,
        password: password,
      });
      
      message.success("Login successful!");
      
      let role = "";

      if(response.data.role === "Administrator")
        role = "admin";
      else if(response.data.role === "Student")
        role = "student";
      else if(response.data.role === "Faculty")
        role = "teacher";
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (error) {
      message.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
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

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue("email");
      console.log(email);
      await validateDundeeEmail(null, email);
      await axios.post(
        "http://47.113.186.66:8080/api/auth/send-code",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );      
      message.success("Verification code sent. It’s valid for 10 minutes.");
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to send code. Please check your email.");
    }
  };

  const handleVerifyLogin = async () => {
    try {
      const values = await form.validateFields();
      const { email, code } = values;
  
      const response = await axios.post(
        "http://47.113.186.66:8080/api/auth/verify-code",
        { email, code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      message.success("Login successful!");
  
      let role = "";
  
      if (response.data.role === "Administrator") role = "admin";
      else if (response.data.role === "Student") role = "student";
      else if (response.data.role === "Teacher") role = "teacher";
      else if (response.data.role === "Faculty") role = "teacher";
  
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", response.data.userId);
      navigate("/");
    } catch (error) {
      console.error("Verify code error:", error);
      message.error(
        error.response?.data?.message || "Verification failed. Please check the code."
      );
    }
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.9)",
          clipPath: "ellipse(100% 40% at 50% 20%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          zIndex: 2,
          // padding: "40px 30px",
          width: 400,
          // marginTop: "10vh",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 30, color: "#4161d9" }}>
          DIICSU Room Booking
        </h2>
        <Tabs
          activeKey={loginMethod}
          onChange={setLoginMethod}
          centered
          items={[
            { key: "password", label: "Password Login" },
            { key: "emailCode", label: "Email Code Login" },
          ]}
        />
        <Form
  form={form}
  layout="vertical"
  onFinish={onFinish}
  style={{
    background: "rgba(255,255,255,0.9)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  }}
>
  {loginMethod === "password" ? (
    <>
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
    </>
  ) : (
    <>
      <Form.Item label="Email" name="email" rules={[{ validator: validateDundeeEmail }]}>
        <Input placeholder="Enter Dundee email" />
      </Form.Item>
      <Form.Item
        label="Verification Code"
        name="code"
        rules={[{ required: true, message: "Enter the code sent to your email" }]}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Input placeholder="Enter code" style={{ flex: 1 }} />
          <Button type="primary" onClick={handleSendCode}>
            Send Code
          </Button>
        </div>
      </Form.Item>
      <Form.Item>
      <Button type="primary" block onClick={handleVerifyLogin}>
          Verify & Login
      </Button>
      </Form.Item>
    </>
  )}
</Form>

      </div>
    </div>
  );
};

export default Login;