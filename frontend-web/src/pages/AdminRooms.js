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
  Space,
  Modal,
  Select,
  Switch,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const AdminRooms = () => {
  const API_BASE = "http://47.113.186.66:8080/api";

  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE}/rooms`);
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      message.error("Failed to fetch rooms from the server.");
    }
  };

  const handleSearch = async (values) => {
    try {
      const queryParams = {};
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
          queryParams[key] = values[key];
        }
      }
      const query = new URLSearchParams(queryParams).toString();
      const response = await fetch(`${API_BASE}/rooms/search?${query}`);
      const data = await response.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error("Failed to search rooms.");
    }
  };

  const handleDelete = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE}/rooms/${roomId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Room deleted successfully.");
        fetchRooms();
      } else {
        message.error("Failed to delete room.");
      }
    } catch (error) {
      message.error("Error occurred while deleting room.");
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      name: values.name,
      capacity: values.capacity,
      location: values.location,
      available: values.available,
      restricted: values.restricted,
    };

    const url = editingRoom
      ? `${API_BASE}/rooms/${editingRoom.id}`
      : `${API_BASE}/rooms`;
    const method = editingRoom ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success(
          editingRoom ? "Room updated successfully" : "Room created successfully"
        );
        setModalVisible(false);
        fetchRooms();
      } else {
        message.error("Failed to save room.");
      }
    } catch (error) {
      message.error("Error occurred while saving room.");
    }
  };

  const columns = [
    { title: "Room ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      render: (cap) => <Tag color="blue">{cap} seats</Tag>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (loc) => loc || <em style={{ color: "#999" }}>Not provided</em>,
    },
    {
      title: "Available",
      dataIndex: "available",
      key: "available",
      render: (val) => (val ? <Tag color="green">Yes</Tag> : <Tag color="red">No</Tag>),
    },
    {
      title: "Restricted",
      dataIndex: "restricted",
      key: "restricted",
      render: (val) => (val ? <Tag color="orange">Restricted</Tag> : <Tag color="cyan">Open</Tag>),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this room?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingRoom(record);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      capacity: record.capacity,
      location: record.location,
      available: record.available,
      restricted: record.restricted,
    });
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingRoom(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <div style={{ padding: 40, background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={2} style={{ color: "#4161d9", marginBottom: 24 }}>
        <HomeOutlined style={{ marginRight: 8 }} /> Room Management
      </Title>

      <Card title="Search Rooms" style={{ marginBottom: 24 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch}>
          <Form.Item name="roomName" label="Room Name">
            <Input placeholder="Search by room name" />
          </Form.Item>
          <Form.Item name="minCapacity" label="Min Capacity">
            <InputNumber placeholder="Min capacity" />
          </Form.Item>
          <Form.Item name="weekNumber" label="Week Number">
            <InputNumber placeholder="Week number" />
          </Form.Item>
          <Form.Item name="dayOfWeek" label="Day of Week">
            <Select placeholder="Day of week">
              <Select.Option value={1}>Monday</Select.Option>
              <Select.Option value={2}>Tuesday</Select.Option>
              <Select.Option value={3}>Wednesday</Select.Option>
              <Select.Option value={4}>Thursday</Select.Option>
              <Select.Option value={5}>Friday</Select.Option>
              <Select.Option value={6}>Saturday</Select.Option>
              <Select.Option value={7}>Sunday</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeSlotStart" label="Time Slot Start">
            <InputNumber placeholder="Start time" />
          </Form.Item>
          <Form.Item name="timeSlotEnd" label="Time Slot End">
            <InputNumber placeholder="End time" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="Existing Rooms"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Room
          </Button>
        }
      >
        <Table columns={columns} dataSource={rooms} rowKey="id" pagination={{ pageSize: 6 }} />
      </Card>

      <Modal
        title={editingRoom ? "Edit Room" : "Add New Room"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item name="id" label="Room ID">
            <Input placeholder="Auto-generated or existing" disabled={!!editingRoom} />
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
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item name="available" label="Available" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="restricted" label="Restricted" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRooms;