package com.example.roombooking.repository;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    // Modify the original conflicting query to use more precise parameter names
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status = 'confirmed' " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findConflictingBookings(
        @Param("roomId") Long roomId, 
        @Param("startTime") LocalDateTime start, 
        @Param("endTime") LocalDateTime end);
    
    // Find all non-cancelled reservations with overlapping times
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status != :status " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findByRoomIdAndStatusNotAndTimeOverlap(
        @Param("roomId") Long roomId, 
        @Param("status") Booking.BookingStatus status,
        @Param("startTime") LocalDateTime startTime, 
        @Param("endTime") LocalDateTime endTime);
    
    // Find bookings with a specific status and overlapping times
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId AND b.status = :status " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findByRoomIdAndStatusAndTimeOverlap(
        @Param("roomId") Long roomId, 
        @Param("status") Booking.BookingStatus status,
        @Param("startTime") LocalDateTime startTime, 
        @Param("endTime") LocalDateTime endTime);
    
    // Find user bookings after a specified time period
    List<Booking> findByUserAndStartTimeAfter(User user, LocalDateTime now);
    
    // Find all bookings within a specific time range
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND " +
           "(b.startTime < :endTime AND b.endTime > :startTime)")
    List<Booking> findByStatusAndTimeOverlap(
        @Param("status") Booking.BookingStatus status,
        @Param("startTime") LocalDateTime startTime, 
        @Param("endTime") LocalDateTime endTime);
    
    // Find all reservations for a specified room within a specific date
    @Query("SELECT b FROM Booking b WHERE b.room.id = :roomId " +
           "AND DATE(b.startTime) = DATE(:date) " +
           "ORDER BY b.startTime")
    List<Booking> findByRoomIdAndDate(
        @Param("roomId") Long roomId, 
        @Param("date") LocalDateTime date);
}