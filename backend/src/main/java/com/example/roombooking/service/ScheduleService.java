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

    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public List<Schedule> getSchedulesByRoom(Long roomId) {
        Optional<Room> room = roomRepository.findById(roomId);
        return room.map(value -> scheduleRepository.findByRoom(value)).orElse(List.of());
    }

    public List<Schedule> getCurrentWeekSchedules() {
        Integer currentWeek = weekService.getCurrentWeekNumber();
        return scheduleRepository.findByWeekNumber(currentWeek);
    }

    public List<Schedule> getCurrentWeekSchedulesByRoom(Long roomId) {
        Integer currentWeek = weekService.getCurrentWeekNumber();
        return scheduleRepository.findByRoomIdAndWeekNumber(roomId, currentWeek);
    }

    public List<Schedule> getSchedulesByRoomAndWeekAndDay(Long roomId, Integer weekNumber, Integer weekday) {
        return scheduleRepository.findByRoomIdAndWeekNumberAndWeekday(roomId, weekNumber, weekday);
    }

    public boolean hasScheduleConflict(Long roomId, Integer weekNumber, Integer weekday, LocalTime startTime, LocalTime endTime) {
        List<Schedule> conflictingSchedules = scheduleRepository.findConflictingSchedules(
            roomId, weekNumber, weekday, startTime, endTime);
        return !conflictingSchedules.isEmpty();
    }

    public Schedule createSchedule(Schedule schedule) {
        Room room = roomRepository.findById(schedule.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        schedule.setRoom(room);

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

    public Schedule updateSchedule(Long id, Schedule schedule) {
        if (!scheduleRepository.existsById(id)) {
            return null;
        }
        
        schedule.setId(id);

        Room room = roomRepository.findById(schedule.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        schedule.setRoom(room);
        
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    public List<Schedule> searchByInstructor(String instructorName) {
        return scheduleRepository.findByInstructorContaining(instructorName);
    }

    public List<Schedule> searchByCourseName(String courseName) {
        return scheduleRepository.findByCourseNameContaining(courseName);
    }

    public List<Schedule> getSchedulesByGroupId(String groupId) {
        return scheduleRepository.findByGroupId(groupId);
    }
}