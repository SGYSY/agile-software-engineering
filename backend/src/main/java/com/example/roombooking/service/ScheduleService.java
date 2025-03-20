package com.example.roombooking.service;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.Schedule;
import com.example.roombooking.repository.RoomRepository;
import com.example.roombooking.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
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
    
    public List<Schedule> getSchedulesByRoomAndTimeRange(Long roomId, LocalDateTime start, LocalDateTime end) {
        Optional<Room> room = roomRepository.findById(roomId);
        if (room.isEmpty()) {
            return List.of();
        }
        return scheduleRepository.findByRoomAndStartTimeBetween(room.get(), start, end);
    }
    
    public Schedule createSchedule(Schedule schedule) {
        // 确保关联的房间存在
        Room room = roomRepository.findById(schedule.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        schedule.setRoom(room);
        
        return scheduleRepository.save(schedule);
    }
    
    public Schedule updateSchedule(Long id, Schedule schedule) {
        if (!scheduleRepository.existsById(id)) {
            return null;
        }
        
        schedule.setId(id);
        return scheduleRepository.save(schedule);
    }
    
    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}