package com.example.roombooking.controller;

import com.example.roombooking.entity.Schedule;
import com.example.roombooking.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;
    
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Optional<Schedule> schedule = scheduleService.getScheduleById(id);
        return schedule.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Schedule>> getSchedulesByRoom(@PathVariable Long roomId) {
        List<Schedule> schedules = scheduleService.getSchedulesByRoom(roomId);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/room/{roomId}/time-range")
    public ResponseEntity<List<Schedule>> getSchedulesByRoomAndTimeRange(
            @PathVariable Long roomId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Schedule> schedules = scheduleService.getSchedulesByRoomAndTimeRange(roomId, start, end);
        return ResponseEntity.ok(schedules);
    }
    
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        Schedule createdSchedule = scheduleService.createSchedule(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        Schedule updatedSchedule = scheduleService.updateSchedule(id, schedule);
        if (updatedSchedule == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedSchedule);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        if (scheduleService.getScheduleById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}