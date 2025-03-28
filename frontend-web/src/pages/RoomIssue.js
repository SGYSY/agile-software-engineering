import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  Button,
  Input,
  Modal,
  message,
  Typography,
  Card,
  Space,
  Empty,
  Tag,
  Tooltip
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;

const RoomIssue = () => {
  const { roomId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newIssueName, setNewIssueName] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const apiUrl = "http://47.113.186.66:8080/api/room-issues";

  // 获取用户角色
  const userRole = localStorage.getItem("userRole");

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/room/${roomId}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      message.error("Failed to fetch issues");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, [roomId]);

  const handleCreateIssue = async () => {
    if (!newIssueName || !newIssueDescription) {
      return message.error("Please enter both issue name and description");
    }
    try {
      const response = await fetch(`${apiUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room: { id: parseInt(roomId, 10) },
          issueName: newIssueName,
          description: newIssueDescription,
        }),
      });
      if (response.ok) {
        message.success("Issue created successfully");
        setNewIssueName("");
        setNewIssueDescription("");
        fetchIssues();
        setIsModalVisible(false);
      } else {
        message.error("Issue creation failed");
      }
    } catch (error) {
      console.error("Failed to create issue:", error);
      message.error("Issue creation failed");
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      const response = await fetch(`${apiUrl}/${issueId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Issue deleted successfully");
        fetchIssues();
      } else {
        message.error("Issue deletion failed");
      }
    } catch (error) {
      console.error("Failed to delete issue:", error);
      message.error("Issue deletion failed");
    }
  };

  return (
    <div style={{ padding: "40px", background: "#f5f8fc", minHeight: "100vh" }}>
      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        title={
          <Space>
            <FieldTimeOutlined style={{ color: "#4161d9" }} />
            <Title level={4} style={{ margin: 0, color: "#4161d9" }}>
              Issues for Room #{roomId}
            </Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Report Issue
          </Button>
        }
      >
        <List
          loading={loading}
          locale={{ emptyText: <Empty description="No issues reported yet." /> }}
          dataSource={issues}
          renderItem={(issue) => (
            <List.Item
              key={issue.id}
              style={{
                border: "1px solid #e4eaf1",
                borderRadius: 10,
                padding: 16,
                marginBottom: 12,
                background: "#ffffff",
              }}
              actions={
                userRole === "admin" ? [ // 只有管理员可以看到删除按钮
                  <Tooltip title="Delete this issue">
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDeleteIssue(issue.id)}
                    >
                      Delete
                    </Button>
                  </Tooltip>,
                ] : [] // 对于其他角色，不显示删除按钮
              }
            >
              <List.Item.Meta
                title={
                  <Text strong>
                    #{issue.id} - {issue.issueName}
                  </Text>
                }
                description={<Text type="secondary">{issue.description}</Text>}
              />
              <Tag color="red" style={{ marginTop: 8 }}>Unresolved</Tag>
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Report a New Issue"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleCreateIssue}
        okText="Submit"
        cancelText="Cancel"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Issue Title"
            value={newIssueName}
            onChange={(e) => setNewIssueName(e.target.value)}
          />
          <Input.TextArea
            rows={4}
            placeholder="Detailed description of the issue"
            value={newIssueDescription}
            onChange={(e) => setNewIssueDescription(e.target.value)}
          />
        </Space>
      </Modal>
    </div>
  );
};

export default RoomIssue;
