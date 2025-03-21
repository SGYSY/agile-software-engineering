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
    // 根据房间查找所有课程安排
    List<Schedule> findByRoom(Room room);
    
    // 根据房间ID查找所有课程安排
    List<Schedule> findByRoomId(Long roomId);
    
    // 根据周数和星期几查找课程安排
    List<Schedule> findByWeekNumberAndWeekday(Integer weekNumber, Integer weekday);
    
    // 根据房间ID、周数和星期几查找课程安排
    List<Schedule> findByRoomIdAndWeekNumberAndWeekday(Long roomId, Integer weekNumber, Integer weekday);
    
    // 根据周数查找所有课程安排
    List<Schedule> findByWeekNumber(Integer weekNumber);
    
    // 根据房间ID和周数查找课程安排
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

    
    // 根据教师名字查找课程
    List<Schedule> findByInstructorContaining(String instructorName);
    
    // 根据课程名称查找课程
    List<Schedule> findByCourseNameContaining(String courseName);
    
    // 根据班级/组ID查找课程
    List<Schedule> findByGroupId(String groupId);
}