import React, { useState, useEffect } from "react";
// 如果需要使用 Select，则添加下面的导入，否则请删除相关代码
import { Card, Form, Input, InputNumber, Button, message, Table, Select } from "antd";
const { Option } = Select; // 如果不使用 Option，可以删除这一行

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(storedRooms);
  }, []);

  const refreshRooms = () => {
    const storedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(storedRooms);
  };

  const handleDelete = (roomId) => {
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    message.success("Room deleted successfully");
    refreshRooms();
  };

  const onFinish = (values) => {
    const newRoom = {
      id: values.id,
      name: values.name,
      capacity: values.capacity,
      equipment: values.equipment ? values.equipment.split(",").map(item => item.trim()) : [],
      bookingLimit: values.bookingLimit,
      allowedRoles: values.allowedRoles.split(",").map(item => item.trim())
    };
    const updatedRooms = [...rooms, newRoom];
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    message.success("Room created successfully");
    refreshRooms();
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    { title: "Equipment", dataIndex: "equipment", key: "equipment", render: (equip) => equip.join(", ") },
    { title: "Booking Limit", dataIndex: "bookingLimit", key: "bookingLimit" },
    { title: "Allowed Roles", dataIndex: "allowedRoles", key: "allowedRoles", render: (roles) => roles.join(", ") },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      )
    },
  ];

  return (
    <Card title="Manage Rooms" style={{ padding: 20 }}>
      <Table columns={columns} dataSource={rooms} rowKey="id" pagination={false} />
      <Card type="inner" title="Create New Room" style={{ marginTop: 20 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="id" label="Room ID" rules={[{ required: true, message: "Please enter room ID" }]}>
            <Input placeholder="Enter room ID" />
          </Form.Item>
          <Form.Item name="name" label="Room Name" rules={[{ required: true, message: "Please enter room name" }]}>
            <Input placeholder="Enter room name" />
          </Form.Item>
          <Form.Item name="capacity" label="Capacity" rules={[{ required: true, message: "Please enter room capacity" }]}>
            <InputNumber placeholder="Enter capacity" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="equipment" label="Equipment (comma separated)">
            <Input placeholder="e.g. projector, board" />
          </Form.Item>
          <Form.Item name="bookingLimit" label="Booking Limit" rules={[{ required: true, message: "Please enter booking limit" }]}>
            <InputNumber placeholder="Enter booking limit" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="allowedRoles" label="Allowed Roles (comma separated)" rules={[{ required: true, message: "Please enter allowed roles" }]}>
            <Input placeholder="e.g. admin, teacher, student" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Room
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Card>
  );
};

export default AdminRooms;
