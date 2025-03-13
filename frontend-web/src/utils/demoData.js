export const getRooms = () => {
  const storedRooms = localStorage.getItem("rooms");
  if (storedRooms) return JSON.parse(storedRooms);

  // 默认房间数据
  // A101：大房间，只允许老师和管理员预约（例如60人，预约上限3人）
  // B102：中房间，允许所有角色预约（例如40人，预约上限2人）
  // C203：小房间，允许所有角色预约，但只能一人预约
  // D204：大房间，允许所有角色预约，且可以多人预约（例如60人，预约上限4人）
  const defaultRooms = [
    { 
      id: "101", 
      name: "A101", 
      capacity: 60, 
      equipment: ["projector", "board"],
      bookingLimit: 3,           
      allowedRoles: ["admin", "teacher"] 
    },
    { 
      id: "102", 
      name: "B102", 
      capacity: 40, 
      equipment: ["board"],
      bookingLimit: 2,           
      allowedRoles: ["admin", "teacher", "student"]
    },
    { 
      id: "103", 
      name: "C203", 
      capacity: 20, 
      equipment: ["pc"],
      bookingLimit: 1,           
      allowedRoles: ["admin", "teacher", "student"]
    },
    { 
      id: "104", 
      name: "D204", 
      capacity: 60, 
      equipment: ["projector", "pc"],
      bookingLimit: 4,           
      allowedRoles: ["admin", "teacher", "student"]
    }
  ];

  localStorage.setItem("rooms", JSON.stringify(defaultRooms)); // 强制写入数据
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
