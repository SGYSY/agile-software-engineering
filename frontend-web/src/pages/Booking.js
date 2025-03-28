import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, DatePicker, Select, Button, message, Descriptions, Input } from "antd";
import moment from "moment";

const { Option } = Select;

// Fixed time slots
const timeSlots = [
  "08:00 - 08:45",
  "08:55 - 09:40",
  "10:00 - 10:45",
  "10:55 - 11:40",
  "14:00 - 14:45",
  "14:55 - 15:40",
  "16:00 - 16:45",
  "16:55 - 17:40",
  "19:00 - 19:45",
  "19:55 - 20:40",
];

const scheduleStartDate = moment("2025-02-17", "YYYY-MM-DD");

const Booking = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Room details from backend
  const [room, setRoom] = useState(null);
  const userRole = localStorage.getItem("userRole");
  const userId = parseInt(localStorage.getItem("userId") || "1", 10);

  // Get initial date & timeSlot from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const initialDate = searchParams.get("date"); // e.g., "2025-03-20"
  const initialTimeSlot = searchParams.get("timeSlot"); // e.g., "14:00 - 14:45"

  const [date, setDate] = useState(initialDate ? moment(initialDate) : null);
  const [timeSlot, setTimeSlot] = useState(initialTimeSlot || null);
  const [purpose, setPurpose] = useState("");

  // Fetch room details
  useEffect(() => {
    fetch(`http://47.113.186.66:8080/api/rooms/${roomId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch room details");
        }
        return res.json();
      })
      .then((data) => setRoom(data))
      .catch((err) => message.error("Error fetching room details: " + err.message));
  }, [roomId]);

  if (!room) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Room not found</p>;
  }

  if (
    userRole === "student" &&
    room.allowedRoles &&
    !room.allowedRoles.includes("student")
  ) {
    return (
      <p style={{ textAlign: "center", marginTop: 50 }}>
        You do not have permission to book this room.
      </p>
    );
  }

  const handleBooking = () => {
    if (!date || !timeSlot) {
      return message.error("Please select a date and time slot!");
    }
    if (!purpose) {
      return message.error("Please enter a purpose for the booking!");
    }

    const dateStr = date.format("YYYY-MM-DD");

    const weekNumber = date.diff(scheduleStartDate, "weeks") + 1;
    const dayOfWeek = date.isoWeekday();

    const [startStr, endStr] = timeSlot.split(" - ");
    const formattedStartTime = startStr.length === 5 ? startStr + ":00" : startStr;
    const formattedEndTime = endStr.length === 5 ? endStr + ":00" : endStr;

    const bookingRequest = {
      user: { id: userId },
      room: { id: room.id },
      weekNumber: weekNumber,
      dayOfWeek: dayOfWeek,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      purpose: purpose,
    };

    console.log("Booking Request:", bookingRequest);

    fetch("http://47.113.186.66:8080/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingRequest),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text || "Failed to create booking");
          });
        }
        return response.json();
      })
      .then((data) => {
        message.success("Booking submitted successfully!");
        navigate("/");
      })
      .catch((err) => {
        message.error("Booking failed: " + err.message);
      });
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        title={`Book Room: ${room.name}`}
        style={{
          maxWidth: 500,
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Capacity">
            {room.capacity} people
          </Descriptions.Item>
          <Descriptions.Item label="Equipment">
            {room.equipment ? room.equipment.join(", ") : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Booking Limit">
            Only one booking per time slot
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 20 }}>
          <DatePicker
            value={date}
            onChange={(value) => setDate(value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <Select
            placeholder="Select a time slot"
            onChange={setTimeSlot}
            style={{ width: "100%", marginBottom: 10 }}
            value={timeSlot}
          >
            {timeSlots.map((slot) => (
              <Option key={slot} value={slot}>
                {slot}
              </Option>
            ))}
          </Select>
          <Input
            placeholder="Enter purpose for booking"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            style={{ width: "100%", marginBottom: 10 }}
          />
          <Button
            type="primary"
            block
            onClick={handleBooking}
            size="large"
            style={{ borderRadius: "5px" }}
          >
            Submit Booking
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Booking;
