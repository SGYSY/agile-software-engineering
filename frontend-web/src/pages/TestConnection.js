import React, { useState } from "react";
import { Button, message } from "antd";

const TestConnection = () => {
  const [result, setResult] = useState("");

  const testConnection = async () => {
    try {
      const response = await fetch("http://47.113.186.66:8080/api/rooms");
      if (!response.ok) {
        throw new Error("Network response error，error code：" + response.status);
      }
      const text = await response.text();
      console.log("Response text:", text);
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
      setResult(JSON.stringify(data, null, 2));
      message.success("Connected backend and try to get data successfully!");
    } catch (error) {
      console.error("Error connecting to server:", error);
      message.error("Connect failed: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button type="primary" onClick={testConnection}>
        test connection
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
