import React, { useState, useEffect } from "react";
import { Card } from "antd";
import ProTable from "@ant-design/pro-table";

const AdminUsers = () => {
  // 假设用户信息存储在 localStorage 的 "users" 键下
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const columns = [
    { title: "User ID", dataIndex: "id", key: "id" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Display Name", dataIndex: "displayName", key: "displayName" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  return (
    <Card title="User Information" style={{ padding: 20 }}>
      <ProTable columns={columns} dataSource={users} rowKey="id" search={{ labelWidth: "auto" }} />
    </Card>
  );
};

export default AdminUsers;
