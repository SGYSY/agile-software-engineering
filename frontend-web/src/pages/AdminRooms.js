import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  message,
  Table,
  Tag,
  Typography,
  Popconfirm,
  Space
} from "antd";
import { DeleteOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";

const { Title } = Typography;

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
      equipment: values.equipment
        ? values.equipment.split(",").map((item) => item.trim())
        : [],
      bookingLimit: values.bookingLimit,
      allowedRoles: values.allowedRoles
        ? values.allowedRoles.split(",").map((item) => item.trim())
        : []
    };
    const updatedRooms = [...rooms, newRoom];
    localStorage.setItem("rooms", JSON.stringify(updatedRooms));
    message.success("Room created successfully");
    refreshRooms();
  };

  const columns = [
    { title: "Room ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (cap) => <Tag color="blue">{cap} seats</Tag>
    },
    {
      title: "Equipment",
      dataIndex: "equipment",
      key: "equipment",
      render: (equip) => equip.map((e, i) => <Tag key={i}>{e}</Tag>)
    },
    { title: "Booking Limit", dataIndex: "bookingLimit", key: "bookingLimit" },
    {
      title: "Allowed Roles",
      dataIndex: "allowedRoles",
      key: "allowedRoles",
      render: (roles) => roles.map((r, i) => <Tag color="purple" key={i}>{r}</Tag>)
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this room?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger icon={<DeleteOutlined />}>Delete</Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div style={{ padding: 40, background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={2} style={{ color: "#4161d9", marginBottom: 24 }}>
        <HomeOutlined style={{ marginRight: 8 }} /> Room Management
      </Title>

      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        title="Existing Rooms"
      >
        <Table
          columns={columns}
          dataSource={rooms}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <Card
        style={{ marginTop: 24, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
        type="inner"
        title="Add New Room"
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="id"
            label="Room ID"
            rules={[{ required: true, message: "Please enter room ID" }]}
          >
            <Input placeholder="Enter room ID" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Room Name"
            rules={[{ required: true, message: "Please enter room name" }]}
          >
            <Input placeholder="Enter room name" />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="Capacity"
            rules={[{ required: true, message: "Please enter capacity" }]}
          >
            <InputNumber placeholder="Enter capacity" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="equipment" label="Equipment (comma separated)">
            <Input placeholder="e.g. projector, board" />
          </Form.Item>
          <Form.Item
            name="bookingLimit"
            label="Booking Limit"
            rules={[{ required: true, message: "Please enter booking limit" }]}
          >
            <InputNumber placeholder="Enter limit" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="allowedRoles"
            label="Allowed Roles (comma separated)"
            rules={[{ required: true, message: "Please enter allowed roles" }]}
          >
            <Input placeholder="e.g. admin, teacher, student" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Create Room
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminRooms;
