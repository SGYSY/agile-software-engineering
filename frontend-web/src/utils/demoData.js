export const getRooms = () => {
  const storedRooms = localStorage.getItem("rooms");
  if (storedRooms) return JSON.parse(storedRooms);

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

  localStorage.setItem("rooms", JSON.stringify(defaultRooms));
  return defaultRooms;
};




export const getBookings = () => JSON.parse(localStorage.getItem("bookings")) || [];

export const saveBooking = (newBooking) => {
  const bookings = getBookings();
  bookings.push(newBooking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

export const deleteBooking = (id) => {
  const bookings = getBookings().filter(b => b.id !== id);
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

export const updateBookingStatus = (id, status) => {
  const bookings = getBookings().map(b => (b.id === id ? { ...b, status } : b));
  localStorage.setItem("bookings", JSON.stringify(bookings));
};

export const getNotifications = () => JSON.parse(localStorage.getItem("notifications")) || [];

export const saveNotification = (user, message) => {
  const notifications = getNotifications();
  notifications.push({ id: Date.now().toString(), user, message, read: false });
  localStorage.setItem("notifications", JSON.stringify(notifications));
};

export const markNotificationAsRead = (id) => {
  const notifications = getNotifications().map(n => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem("notifications", JSON.stringify(notifications));
};

export const clearAllData = () => {
  localStorage.removeItem("rooms");
  localStorage.removeItem("bookings");
  localStorage.removeItem("notifications");
  console.log("All data cleared");
};
