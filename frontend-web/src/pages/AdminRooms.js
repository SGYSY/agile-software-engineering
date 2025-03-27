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
  List,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

const AdminRooms = () => {
  const API_BASE = "http://47.113.186.66:8080/api";

  // 房间管理状态
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();

  // 维护相关状态：设置房间为 under maintenance
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [maintenanceForm] = Form.useForm();
  const [selectedRoomForMaintenance, setSelectedRoomForMaintenance] = useState(null);

  // 用于查看房间问题
  const [issuesModalVisible, setIssuesModalVisible] = useState(false);
  const [roomIssues, setRoomIssues] = useState([]);

  // 房间权限相关状态（针对特定教师权限）
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissionForm] = Form.useForm();
  const [teachers, setTeachers] = useState([]);

  // 获取教师列表（roleid 为 2）
  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users?roleId=2`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      message.error("Failed to fetch teachers.");
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchTeachers();
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

  // 恢复为原先的 inline 搜索 UI
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
      // restricted 值：0=所有用户，1=所有教师，2=特定教师
      restricted: values.restricted,
    };

    const url = editingRoom
      ? `${API_BASE}/rooms/${editingRoom.id}`
      : `${API_BASE}/rooms`;
    const method = editingRoom ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        message.success(editingRoom ? "Room updated successfully" : "Room created successfully");
        setModalVisible(false);
        fetchRooms();
      } else {
        message.error("Failed to save room.");
      }
    } catch (error) {
      message.error("Error occurred while saving room.");
    }
  };

  // -------------------------------
  // 维护 / Room Issue 操作
  // -------------------------------
  const openMaintenanceModal = (room) => {
    setSelectedRoomForMaintenance(room);
    maintenanceForm.resetFields();
    setMaintenanceModalVisible(true);
  };

  const handleMaintenanceSubmit = async () => {
    try {
      const values = await maintenanceForm.validateFields();
      const roomId = selectedRoomForMaintenance.id;
      const payload = {
        issueName: values.issueName,
        description: values.description,
      };
      const response = await fetch(`${API_BASE}/room-issues/room/${roomId}/maintenance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        message.success("Room marked as under maintenance");
        setMaintenanceModalVisible(false);
        fetchRooms();
      } else {
        message.error("Failed to mark room as under maintenance");
      }
    } catch (error) {
      message.error("Error occurred while marking room under maintenance");
    }
  };

  const markRoomAvailable = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE}/room-issues/room/${roomId}/available`, {
        method: "PATCH",
      });
      if (response.ok) {
        message.success("Room marked as available");
        fetchRooms();
      } else {
        message.error("Failed to mark room as available");
      }
    } catch (error) {
      message.error("Error occurred while marking room as available");
    }
  };

  const viewRoomIssues = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE}/room-issues/room/${roomId}`);
      const data = await response.json();
      setRoomIssues(data);
      setIssuesModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch room issues");
    }
  };

  // -------------------------------
  // Room Permission 操作（针对特定教师权限）
  // -------------------------------
  const openPermissionModal = () => {
    permissionForm.resetFields();
    setPermissionModalVisible(true);
  };

  const handlePermissionSubmit = async () => {
    try {
      const values = await permissionForm.validateFields();
      const roomId = editingRoom.id;
      const teacherId = values.teacherId;
      const endpoint = `${API_BASE}/room-permissions/adduid/${teacherId}/${roomId}`;
      const payload = { room: { id: roomId }, user: { id: teacherId } };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        message.success("Room permission added successfully");
        setPermissionModalVisible(false);
      } else {
        message.error("Failed to add room permission");
      }
    } catch (error) {
      message.error("Error occurred while adding room permission");
    }
  };

  // -------------------------------
  // 表格列设置
  // -------------------------------
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
      render: (val) =>
        val ? <Tag color="green">Available</Tag> : <Tag color="red">Under Maintenance</Tag>,
    },
    {
      title: "Restricted",
      dataIndex: "restricted",
      key: "restricted",
      render: (val) => {
        if (val === 0) return <Tag color="green">Open to All</Tag>;
        if (val === 1) return <Tag color="blue">Teachers Only</Tag>;
        if (val === 2) return <Tag color="orange">Specific Teachers</Tag>;
        return <Tag>Unknown</Tag>;
      },
    },
    {
      title: "Maintenance",
      key: "maintenance",
      render: (_, record) => (
        <Space>
          {record.available ? (
            <Button size="small" type="primary" onClick={() => openMaintenanceModal(record)}>
              Set Under Maintenance
            </Button>
          ) : (
            <Button size="small" danger onClick={() => markRoomAvailable(record.id)}>
              Set Available
            </Button>
          )}
          <Button size="small" onClick={() => viewRoomIssues(record.id)}>
            View Issues
          </Button>
        </Space>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm title="Are you sure to delete this room?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setEditingRoom(record);
    // 设置初始值时，将 restricted 值直接传递（0,1,2）
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

      {/* 恢复为 inline 搜索 UI */}
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

      {/* 添加/编辑房间 Modal */}
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
          <Form.Item name="name" label="Room Name" rules={[{ required: true, message: "Please enter room name" }]}>
            <Input placeholder="Enter room name" />
          </Form.Item>
          <Form.Item name="capacity" label="Capacity" rules={[{ required: true, message: "Please enter capacity" }]}>
            <InputNumber placeholder="Enter capacity" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter location" }]}>
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item name="available" label="Available" valuePropName="checked">
            <Switch />
          </Form.Item>
          {/* 将原 restricted Switch 改为下拉框 */}
          <Form.Item name="restricted" label="Reservation Scope">
            <Select placeholder="Select reservation scope">
              <Select.Option value={0}>All Users</Select.Option>
              <Select.Option value={1}>All Teachers</Select.Option>
              <Select.Option value={2}>Specific Teachers</Select.Option>
            </Select>
          </Form.Item>
          {/* 仅当正在编辑且 restricted 为 2 时显示添加权限区域 */}
          <Form.Item shouldUpdate={(prev, cur) => prev.restricted !== cur.restricted}>
            {() =>
              editingRoom && form.getFieldValue("restricted") === 2 && (
                <div style={{ marginTop: 24, borderTop: "1px solid #e8e8e8", paddingTop: 16 }}>
                  <Title level={5}>Room Permissions</Title>
                  <Button type="dashed" onClick={openPermissionModal}>
                    Add Permission
                  </Button>
                </div>
              )
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* 设置为维修中 Modal */}
      <Modal
        title={`Set Room ${selectedRoomForMaintenance ? selectedRoomForMaintenance.name : ""} Under Maintenance`}
        visible={maintenanceModalVisible}
        onCancel={() => setMaintenanceModalVisible(false)}
        onOk={handleMaintenanceSubmit}
        okText="Submit"
      >
        <Form layout="vertical" form={maintenanceForm}>
          <Form.Item name="issueName" label="Issue Name" rules={[{ required: true, message: "Please enter issue name" }]}>
            <Input placeholder="e.g., Air Conditioning Malfunction" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
            <Input.TextArea placeholder="Describe the issue" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看房间问题 Modal */}
      <Modal
        title="Room Issues"
        visible={issuesModalVisible}
        onCancel={() => setIssuesModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIssuesModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {roomIssues && roomIssues.length > 0 ? (
          <List
            dataSource={roomIssues}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta title={item.issueName} description={item.description || "No description provided"} />
              </List.Item>
            )}
          />
        ) : (
          <p>No issues reported for this room.</p>
        )}
      </Modal>

      {/* 添加房间权限 Modal（仅针对特定教师） */}
      <Modal
        title="Add Room Permission"
        visible={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        onOk={handlePermissionSubmit}
        okText="Submit"
      >
        <Form layout="vertical" form={permissionForm}>
          <Form.Item
            name="teacherId"
            label="Select Teacher"
            rules={[{ required: true, message: "Please select a teacher" }]}
          >
            <Select placeholder="Select a teacher">
              {teachers.map((teacher) => (
                <Select.Option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminRooms;
