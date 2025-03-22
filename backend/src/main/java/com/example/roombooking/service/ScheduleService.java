package com.example.roombooking.service;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.Schedule;
import com.example.roombooking.repository.RoomRepository;
import com.example.roombooking.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private WeekService weekService;
    
    /**
     * 获取所有课程安排
     */
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }
    
    /**
     * 根据ID获取课程安排
     */
    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }
    
    /**
     * 根据房间获取课程安排
     */
    public List<Schedule> getSchedulesByRoom(Long roomId) {
        Optional<Room> room = roomRepository.findById(roomId);
        return room.map(value -> scheduleRepository.findByRoom(value)).orElse(List.of());
    }
    
    /**
     * 获取当前周的所有课程安排
     */
    public List<Schedule> getCurrentWeekSchedules() {
        Integer currentWeek = weekService.getCurrentWeekNumber();
        return scheduleRepository.findByWeekNumber(currentWeek);
    }

    /**
     * 获取特定房间当前周的课程安排
     */
    public List<Schedule> getCurrentWeekSchedulesByRoom(Long roomId) {
        Integer currentWeek = weekService.getCurrentWeekNumber();
        return scheduleRepository.findByRoomIdAndWeekNumber(roomId, currentWeek);
    }
    
    /**
     * 根据周次和日期获取房间课程安排
     */
    public List<Schedule> getSchedulesByRoomAndWeekAndDay(Long roomId, Integer weekNumber, Integer weekday) {
        return scheduleRepository.findByRoomIdAndWeekNumberAndWeekday(roomId, weekNumber, weekday);
    }
    
    /**
     * 检查指定时间段是否与已有课程冲突
     */
    public boolean hasScheduleConflict(Long roomId, Integer weekNumber, Integer weekday, LocalTime startTime, LocalTime endTime) {
        List<Schedule> conflictingSchedules = scheduleRepository.findConflictingSchedules(
            roomId, weekNumber, weekday, startTime, endTime);
        return !conflictingSchedules.isEmpty();
    }
    
    /**
     * 创建课程安排
     */
    public Schedule createSchedule(Schedule schedule) {
        // 确保关联的房间存在
        Room room = roomRepository.findById(schedule.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        schedule.setRoom(room);
        
        // 检查是否与现有课程冲突
        boolean hasConflict = hasScheduleConflict(
            room.getId(), 
            schedule.getWeekNumber(), 
            schedule.getWeekday(), 
            schedule.getStartTime(), 
            schedule.getEndTime()
        );
        
        if (hasConflict) {
            throw new RuntimeException("Schedule conflicts with existing courses");
        }
        
        return scheduleRepository.save(schedule);
    }
    
    /**
     * 更新课程安排
     */
    public Schedule updateSchedule(Long id, Schedule schedule) {
        if (!scheduleRepository.existsById(id)) {
            return null;
        }
        
        schedule.setId(id);
        
        // 验证房间存在
        Room room = roomRepository.findById(schedule.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        schedule.setRoom(room);
        
        return scheduleRepository.save(schedule);
    }
    
    /**
     * 删除课程安排
     */
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
    
    /**
     * 根据教师姓名搜索课程
     */
    public List<Schedule> searchByInstructor(String instructorName) {
        return scheduleRepository.findByInstructorContaining(instructorName);
    }
    
    /**
     * 根据课程名称搜索
     */
    public List<Schedule> searchByCourseName(String courseName) {
        return scheduleRepository.findByCourseNameContaining(courseName);
    }
    
    /**
     * 根据班级/组ID搜索课程
     */
    public List<Schedule> getSchedulesByGroupId(String groupId) {
        return scheduleRepository.findByGroupId(groupId);
    }
}