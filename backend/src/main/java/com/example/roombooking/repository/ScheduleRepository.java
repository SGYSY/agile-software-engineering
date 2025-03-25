package com.example.roombooking.repository;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByRoom(Room room);

    List<Schedule> findByRoomId(Long roomId);

    List<Schedule> findByWeekNumberAndWeekday(Integer weekNumber, Integer weekday);

    List<Schedule> findByRoomIdAndWeekNumberAndWeekday(Long roomId, Integer weekNumber, Integer weekday);

    List<Schedule> findByWeekNumber(Integer weekNumber);

    List<Schedule> findByRoomIdAndWeekNumber(Long roomId, Integer weekNumber);
    
    @Query("SELECT s FROM Schedule s WHERE s.room.id = :roomId " +
       "AND s.weekNumber = :weekNumber AND s.weekday = :weekday " +
       "AND ((s.startTime < :endTime AND s.endTime > :startTime))")
    List<Schedule> findConflictingSchedules(
        @Param("roomId") Long roomId, 
        @Param("weekNumber") Integer weekNumber,
        @Param("weekday") Integer weekday,
        @Param("startTime") LocalTime startTime, 
        @Param("endTime") LocalTime endTime
    );


    List<Schedule> findByInstructorContaining(String instructorName);

    List<Schedule> findByCourseNameContaining(String courseName);

    List<Schedule> findByGroupId(String groupId);
}