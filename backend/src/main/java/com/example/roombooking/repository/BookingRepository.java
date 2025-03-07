package com.example.roombooking.repository;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.room.id = ?1 AND b.status = 'confirmed' " +
           "AND ((b.startTime <= ?3 AND b.endTime >= ?2) OR " +
           "(b.startTime >= ?2 AND b.startTime < ?3))")
    List<Booking> findConflictingBookings(Long roomId, LocalDateTime start, LocalDateTime end);
    
    List<Booking> findByUserAndStartTimeAfter(User user, LocalDateTime now);
}