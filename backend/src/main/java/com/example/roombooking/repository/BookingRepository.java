package com.example.roombooking.repository;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    // 根据房间、周数和星期几查找预订
    List<Booking> findByRoomIdAndWeekNumberAndDayOfWeek(Long roomId, Integer weekNumber, Integer dayOfWeek);
    
    // 查找特定周的所有预订
    List<Booking> findByWeekNumber(Integer weekNumber);
    
    // 查找用户在特定周的预订
    List<Booking> findByUserAndWeekNumber(User user, Integer weekNumber);
    
    // 查找冲突预订（同一房间、同一周、同一天、时间重叠）
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.weekNumber = :weekNumber " +
           "AND b.dayOfWeek = :dayOfWeek AND b.status != 'cancelled' " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
        @Param("roomId") Long roomId, 
        @Param("weekNumber") Integer weekNumber,
        @Param("dayOfWeek") Integer dayOfWeek,
        @Param("startTime") LocalTime startTime, 
        @Param("endTime") LocalTime endTime);
    
    // 查找当前周以后的用户预订（需要传入当前周数）
    List<Booking> findByUserAndWeekNumberGreaterThanEqual(User user, Integer currentWeekNumber);
    
    // 查找特定状态和特定周的预订
    List<Booking> findByStatusAndWeekNumber(Booking.BookingStatus status, Integer weekNumber);
    
    // 查找房间在特定周和特定日期的所有预订
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.weekNumber = :weekNumber " +
           "AND b.dayOfWeek = :dayOfWeek ORDER BY b.startTime")
    List<Booking> findByRoomIdAndWeekAndDay(
        @Param("roomId") Long roomId, 
        @Param("weekNumber") Integer weekNumber,
        @Param("dayOfWeek") Integer dayOfWeek);

    
}