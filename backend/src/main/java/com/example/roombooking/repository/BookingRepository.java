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

    List<Booking> findByRoomIdAndWeekNumberAndDayOfWeek(Long roomId, Integer weekNumber, Integer dayOfWeek);

    List<Booking> findByWeekNumber(Integer weekNumber);

    List<Booking> findByUserAndWeekNumber(User user, Integer weekNumber);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.weekNumber = :weekNumber " +
           "AND b.dayOfWeek = :dayOfWeek AND b.status != 'cancelled' " +
           "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(
        @Param("roomId") Long roomId, 
        @Param("weekNumber") Integer weekNumber,
        @Param("dayOfWeek") Integer dayOfWeek,
        @Param("startTime") LocalTime startTime, 
        @Param("endTime") LocalTime endTime);

    List<Booking> findByUserAndWeekNumberGreaterThanEqual(User user, Integer currentWeekNumber);

    List<Booking> findByStatusAndWeekNumber(Booking.BookingStatus status, Integer weekNumber);

    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.weekNumber = :weekNumber " +
           "AND b.dayOfWeek = :dayOfWeek ORDER BY b.startTime")
    List<Booking> findByRoomIdAndWeekAndDay(
        @Param("roomId") Long roomId, 
        @Param("weekNumber") Integer weekNumber,
        @Param("dayOfWeek") Integer dayOfWeek);

    
}