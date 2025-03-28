import React, { useState, useEffect } from "react";
import { Card, Button, Popconfirm, message, Typography, Modal, Form, Input, Select } from "antd";
import ProTable from "@ant-design/pro-table";
import { HomeOutlined } from "@ant-design/icons";  // Import HomeOutlined icon

const { Title } = Typography;
const { Option } = Select;
const API_BASE = "http://47.113.186.66:8080/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      message.error("Error loading users");
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
      if (res.status === 204) {
        message.success("User deleted");
        fetchUsers();
      } else {
        throw new Error();
      }
    } catch {
      message.error("Failed to delete user");
    }
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    form.setFieldsValue({
      ...record,
      roleId: record.role?.id
    });
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        role: { id: values.roleId }
      };
      const url = editingUser ? `${API_BASE}/users/${editingUser.id}` : `${API_BASE}/users`;
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Save failed");

      message.success(editingUser ? "User updated" : "User created");
      setModalVisible(false);
      fetchUsers();
    } catch {
      message.error("Submit failed");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Full Name", render: (_, r) => `${r.firstName} ${r.lastName}` },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Role", dataIndex: ["role", "roleName"], key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure?" onConfirm={() => deleteUser(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </div>
      )
    },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 40, background: "#eef1f7", minHeight: "100vh" }}>
      <Title level={2} style={{ color: "#4161d9", marginBottom: 24 }}>
        <HomeOutlined style={{ marginRight: 8 }} /> User Management {/* Add the icon here */}
      </Title>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", background: "#fff" }}
        extra={
          <div style={{ display: "flex", gap: 16 }}>
            <Input.Search
              placeholder="Search by username or email"
              allowClear
              onSearch={setSearchText}
              style={{ width: 300 }}
            />
            <Button type="primary" onClick={handleAddNew}>Add New User</Button>
          </div>
        }
      >
        <ProTable
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          search={false}
          pagination={{ pageSize: 7 }}
          toolBarRender={false}
        />
      </Card>

      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        okText="Save"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please enter Username" },
              { whitespace: true, message: "Username cannot be empty" }
            ]}
          >
            <Input readOnly={!!editingUser} />
          </Form.Item>

          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter First Name" },
              { whitespace: true, message: "First Name cannot be empty" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: "Please enter Last Name" },
              { whitespace: true, message: "Last Name cannot be empty" }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Please enter a valid Email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="phoneNumber" label="Phone Number">
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="passwordHash"
              label="Password"
              rules={[{ required: true, message: "Please enter Password" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select a role">
              <Option value={1}>Administrator</Option>
              <Option value={2}>Faculty</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
