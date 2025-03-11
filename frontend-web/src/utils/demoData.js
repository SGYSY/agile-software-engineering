// 📌 获取所有教室
export const getRooms = () => {
  const storedRooms = localStorage.getItem("rooms");
  if (storedRooms) return JSON.parse(storedRooms);

  const defaultRooms = [
    { id: "101", name: "A101", capacity: 50, equipment: ["projector", "board"] },
    { id: "102", name: "B102", capacity: 30, equipment: ["board"] },
    { id: "103", name: "C203", capacity: 20, equipment: ["pc"] },
  ];

  localStorage.setItem("rooms", JSON.stringify(defaultRooms));
  return defaultRooms;
};

// 📌 获取所有预定
export const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];

// 📌 保存新的预定
export const saveBooking = (newBooking) => {
  const bookings = getBookings();
  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

// 📌 删除预定（适用于学生取消 "待审核" 预定）
export const deleteBooking = (id) => {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

// 📌 更新预定状态（管理员批准/拒绝）
export const updateBookingStatus = (id, status) => {
  const bookings = getBookings().map(b => (b.id === id ? { ...b, status } : b));
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

// 📌 获取所有通知
export const getNotifications = () => JSON.parse(localStorage.getItem("notifications")) || [];

// 📌 保存通知（用于审批通过/拒绝时发送给用户）
export const saveNotification = (user, message) => {
  const notifications = getNotifications();
  notifications.push({ id: Date.now().toString(), user, message, read: false });
  localStorage.setItem("notifications", JSON.stringify(notifications));
};

// 📌 标记通知为已读
export const markNotificationAsRead = (id) => {
  const notifications = getNotifications().map(n => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem("notifications", JSON.stringify(notifications));
};

// 📌 清空所有数据（调试 & 重置用）
export const clearAllData = () => {
  localStorage.removeItem("rooms");
  localStorage.removeItem("bookings");
  localStorage.removeItem("notifications");
  console.log("所有数据已清空");
};
