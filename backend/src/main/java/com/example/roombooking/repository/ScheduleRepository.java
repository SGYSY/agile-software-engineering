package com.example.roombooking.repository;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRoom(Room room);
    List<Schedule> findByRoomAndStartTimeBetween(Room room, LocalDateTime start, LocalDateTime end);
}