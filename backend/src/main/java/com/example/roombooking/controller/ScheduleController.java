package com.example.roombooking.controller;

import com.example.roombooking.entity.Schedule;
import com.example.roombooking.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    
    @GetMapping("/current-week")
    public ResponseEntity<List<Schedule>> getCurrentWeekSchedules() {
        List<Schedule> schedules = scheduleService.getCurrentWeekSchedules();
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/room/{roomId}/current-week")
    public ResponseEntity<List<Schedule>> getCurrentWeekSchedulesByRoom(@PathVariable Long roomId) {
        List<Schedule> schedules = scheduleService.getCurrentWeekSchedulesByRoom(roomId);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/room/{roomId}/week/{weekNumber}/day/{weekday}")
    public ResponseEntity<List<Schedule>> getSchedulesByRoomAndWeekAndDay(
            @PathVariable Long roomId,
            @PathVariable Integer weekNumber,
            @PathVariable Integer weekday) {
        List<Schedule> schedules = scheduleService.getSchedulesByRoomAndWeekAndDay(roomId, weekNumber, weekday);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/search/instructor")
    public ResponseEntity<List<Schedule>> searchByInstructor(@RequestParam String name) {
        List<Schedule> schedules = scheduleService.searchByInstructor(name);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/search/course")
    public ResponseEntity<List<Schedule>> searchByCourseName(@RequestParam String name) {
        List<Schedule> schedules = scheduleService.searchByCourseName(name);
        return ResponseEntity.ok(schedules);
    }
    
    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Schedule>> getSchedulesByGroupId(@PathVariable String groupId) {
        List<Schedule> schedules = scheduleService.getSchedulesByGroupId(groupId);
        return ResponseEntity.ok(schedules);
    }
    
    @PostMapping
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        try {
            Schedule createdSchedule = scheduleService.createSchedule(schedule);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        try {
            Schedule updatedSchedule = scheduleService.updateSchedule(id, schedule);
            if (updatedSchedule == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedSchedule);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
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