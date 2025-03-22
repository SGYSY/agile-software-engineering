import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { List, Button, Input, Modal, message } from "antd";

const RoomIssue = () => {
  const { roomId } = useParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 新增两个状态，分别对应 issueName 和 description
  const [newIssueName, setNewIssueName] = useState("");
  const [newIssueDescription, setNewIssueDescription] = useState("");
  
  const [isModalVisible, setIsModalVisible] = useState(false);

  // API endpoint for room issues
  const apiUrl = "http://47.113.186.66:8080/api/room-issues";

  // Fetch all issues for the specified room
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

  // Create a new room issue
  const handleCreateIssue = async () => {
    if (!newIssueName || !newIssueDescription) {
      return message.error("Please enter both issue name and description");
    }
    try {
      const response = await fetch(`${apiUrl}?Content-Type=application/json`, {
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
        // 后续动作，例如：navigation if needed
      } else {
        message.error("Issue creation failed");
      }
    } catch (error) {
      console.error("Failed to create issue:", error);
      message.error("Issue creation failed");
    }
  };

  // Delete a room issue
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
    <div style={{ padding: "20px" }}>
      <h1>Issues for Room {roomId}</h1>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: "20px" }}
      >
        Add Issue
      </Button>
      <List
        loading={loading}
        dataSource={issues}
        renderItem={(issue) => (
          <List.Item
            actions={[
              <Button danger onClick={() => handleDeleteIssue(issue.id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`Issue ID: ${issue.id} - ${issue.issueName}`}
              description={issue.description}
            />
          </List.Item>
        )}
      />

      <Modal
        title="Add Issue"
        visible={isModalVisible}
        onOk={handleCreateIssue}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="Enter issue name"
          value={newIssueName}
          onChange={(e) => setNewIssueName(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <Input.TextArea
          rows={4}
          value={newIssueDescription}
          onChange={(e) => setNewIssueDescription(e.target.value)}
          placeholder="Enter issue description"
        />
      </Modal>
    </div>
  );
};

export default RoomIssue;
