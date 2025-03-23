package com.example.roombooking.repository;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Time;
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

    // 修改后的查询，根据周数、星期和时间段查找可用房间
    @Query(value = "SELECT DISTINCT r.* " +
        "FROM rooms r " +
        "LEFT JOIN bookings b ON r.room_id = b.room_id " +
        "AND (b.status = 'confirmed' OR b.status = 'pending') " +
        "AND b.week_number = :weekNumber " +
        "AND b.day_of_week = :dayOfWeek " +
        "AND b.end_time > :startTime " +
        "AND b.start_time < :endTime " +
        "WHERE r.available = true " +
        "AND b.booking_id IS NULL", 
        nativeQuery = true)
    List<Room> findAvailableRoomsByWeekAndDay(
        @Param("weekNumber") Integer weekNumber,
        @Param("dayOfWeek") Integer dayOfWeek,
        @Param("startTime") Time startTime,
        @Param("endTime") Time endTime);

    /**
     * 查找在指定时间段内可用的房间ID列表
     */
    @Query(value = "SELECT r.room_id " +
    "FROM rooms r " +
    "WHERE r.room_id IN :roomIds " + 
    "AND r.available = true " + 
    "AND NOT EXISTS (" +
    "   SELECT 1 FROM bookings b " +
    "   WHERE b.room_id = r.room_id " +
    "   AND b.week_number = :weekNumber " +
    "   AND b.day_of_week = :dayOfWeek " +
    "   AND b.status != 'cancelled' " +
    "   AND (" +
    "       (b.start_time < :endTime AND b.end_time > :startTime) " +
    "       OR b.start_time = :startTime " +
    "       OR b.end_time = :endTime" +
    "   )" +
    ") " +
    "AND NOT EXISTS (" +
    "   SELECT 1 FROM schedule s " +
    "   WHERE s.room_id = r.room_id " +
    "   AND s.week_number = :weekNumber " +
    "   AND s.weekday = :dayOfWeek " +
    "   AND (" +
    "       (s.start_time < :endTime AND s.end_time > :startTime) " +
    "       OR s.start_time = :startTime " +
    "       OR s.end_time = :endTime" +
    "   )" +
    ")",
    nativeQuery = true)
    List<Long> findAvailableRoomIdsByTimeSlot(
    @Param("weekNumber") Integer weekNumber,
    @Param("dayOfWeek") Integer dayOfWeek,
    @Param("startTime") Time startTime,
    @Param("endTime") Time endTime,
    @Param("roomIds") List<Long> roomIds);
}