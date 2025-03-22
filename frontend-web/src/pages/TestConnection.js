import React, { useState } from "react";
import { Button, message } from "antd";

const TestConnection = () => {
  const [result, setResult] = useState("");

  const testConnection = async () => {
    try {
      // 直接请求后端 API 的完整地址
      const response = await fetch("http://47.113.186.66:8080/api/rooms");
      if (!response.ok) {
        throw new Error("网络响应错误，状态码：" + response.status);
      }
      // 获取原始响应文本
      const text = await response.text();
      console.log("Response text:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      setResult(JSON.stringify(data, null, 2));
      message.success("成功连接到后端并获取数据");
    } catch (error) {
      console.error("Error connecting to server:", error);
      message.error("连接失败: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button type="primary" onClick={testConnection}>
        测试连接
      </Button>
      {result && (
        <pre style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default TestConnection;
