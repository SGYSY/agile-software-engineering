package com.example.roombooking.repository;

import com.example.roombooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByAvailableTrue();
    List<Room> findByCapacityGreaterThanEqual(int capacity);
    
    @Query("SELECT r FROM Room r WHERE r.id NOT IN " +
           "(SELECT b.room.id FROM Booking b WHERE b.status = 'confirmed' " +
           "AND ((b.startTime <= ?2 AND b.endTime >= ?1) OR " +
           "(b.startTime >= ?1 AND b.startTime < ?2)))")
    List<Room> findAvailableRooms(LocalDateTime start, LocalDateTime end);
}