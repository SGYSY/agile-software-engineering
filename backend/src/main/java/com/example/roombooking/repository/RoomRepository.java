package com.example.roombooking.repository;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByAvailableTrue();
    List<Room> findByCapacityGreaterThanEqual(int capacity);
    
    // revised query to find available rooms, avoid time variable type conversion error
    @Query(value = "SELECT DISTINCT r.* " +
       "FROM rooms r " +
       "LEFT JOIN bookings b ON r.room_id = b.room_id " +
       "AND (b.status = 'confirmed' OR b.status = 'pending') " +
       "AND b.end_time > STR_TO_DATE(?1, '%Y-%m-%d %H:%i:%s') " +
       "AND b.start_time < STR_TO_DATE(?2, '%Y-%m-%d %H:%i:%s') " +
       "WHERE r.available = true " +
       "AND b.booking_id IS NULL", 
       nativeQuery = true)
    List<Room> findAvailableRooms(String start, String end);
}