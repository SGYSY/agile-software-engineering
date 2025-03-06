export const getRooms = () => {
    const rooms = localStorage.getItem("rooms");
    if (rooms) return JSON.parse(rooms);
    const defaultRooms = [
      { id: "101", name: "A101", capacity: 50, equipment: ["投影仪", "白板"] },
      { id: "102", name: "B102", capacity: 30, equipment: ["白板"] },
      { id: "103", name: "C203", capacity: 20, equipment: ["无"] },
    ];
    localStorage.setItem("rooms", JSON.stringify(defaultRooms));
    return defaultRooms;
  };
  
  export const getBookings = () => {
    const bookings = localStorage.getItem("bookings");
    return bookings ? JSON.parse(bookings) : [];
  };
  
  export const saveBooking = (newBooking) => {
    const bookings = getBookings();
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
  };
  
  export const deleteBooking = (id) => {
    const bookings = getBookings().filter(b => b.id !== id);
    localStorage.setItem("bookings", JSON.stringify(bookings));
  };
  