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
      message.error("无效的用户 ID");
      return;
    }

    localStorage.setItem("userRole", role);
    message.success(`登录成功，角色：${role}`);
    navigate("/");
  };

  return (
    <Card title="DIICSU 预定系统登录" style={{ maxWidth: 400, margin: "50px auto" }}>
      <Input placeholder="输入用户 ID（123/456/789）" value={userId} onChange={(e) => setUserId(e.target.value)} />
      <Button type="primary" block onClick={handleLogin} style={{ marginTop: 10 }}>
        登录
      </Button>
    </Card>
  );
};

export default Login;
