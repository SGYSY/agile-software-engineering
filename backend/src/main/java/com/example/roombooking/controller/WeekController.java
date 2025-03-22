package com.example.roombooking.controller;

import com.example.roombooking.entity.Week;
import com.example.roombooking.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/weeks")
@CrossOrigin(origins = "*")
public class WeekController {

    @Autowired
    private WeekService weekService;

    @GetMapping
    public ResponseEntity<List<Week>> getAllWeeks() {
        List<Week> weeks = weekService.getAllWeeks();
        return ResponseEntity.ok(weeks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Week> getWeekById(@PathVariable Long id) {
        Optional<Week> week = weekService.getWeekById(id);
        return week.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{weekNumber}")
    public ResponseEntity<Week> getWeekByNumber(@PathVariable Integer weekNumber) {
        Optional<Week> week = weekService.getWeekByNumber(weekNumber);
        return week.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/current")
    public ResponseEntity<Week> getCurrentWeek() {
        Optional<Week> week = weekService.getCurrentWeek();
        return week.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/current-number")
    public ResponseEntity<Integer> getCurrentWeekNumber() {
        Integer weekNumber = weekService.getCurrentWeekNumber();
        return ResponseEntity.ok(weekNumber);
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<Week> getWeekByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Optional<Week> week = weekService.getWeekByDate(date);
        return week.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/date/{date}/number")
    public ResponseEntity<Integer> getWeekNumberByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        Integer weekNumber = weekService.getWeekNumberByDate(date);
        return ResponseEntity.ok(weekNumber);
    }
    
    @GetMapping("/number/{weekNumber}/start-date")
    public ResponseEntity<LocalDate> getWeekStartDate(@PathVariable Integer weekNumber) {
        LocalDate startDate = weekService.getWeekStartDate(weekNumber);
        if (startDate == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(startDate);
    }
    
    @GetMapping("/number/{weekNumber}/end-date")
    public ResponseEntity<LocalDate> getWeekEndDate(@PathVariable Integer weekNumber) {
        LocalDate endDate = weekService.getWeekEndDate(weekNumber);
        if (endDate == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(endDate);
    }
    
    @GetMapping("/number/{weekNumber}/date-range")
    public ResponseEntity<String> getWeekDateRange(@PathVariable Integer weekNumber) {
        String dateRange = weekService.getWeekDateRange(weekNumber);
        return ResponseEntity.ok(dateRange);
    }
    
    @PostMapping
    public ResponseEntity<Week> createWeek(@RequestBody Week week) {
        Week savedWeek = weekService.saveWeek(week);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWeek);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Week> updateWeek(@PathVariable Long id, @RequestBody Week week) {
        if (!weekService.getWeekById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        week.setId(id);
        Week updatedWeek = weekService.saveWeek(week);
        return ResponseEntity.ok(updatedWeek);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWeek(@PathVariable Long id) {
        if (!weekService.getWeekById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        
        weekService.deleteWeek(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/generate")
    public ResponseEntity<Void> generateWeeks(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam Integer numWeeks) {
        weekService.generateWeeks(startDate, numWeeks);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/is-date-in-teaching-week/{date}")
    public ResponseEntity<Boolean> isDateInTeachingWeek(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        boolean isInTeachingWeek = weekService.isDateInTeachingWeek(date);
        return ResponseEntity.ok(isInTeachingWeek);
    }
    
    @GetMapping("/is-current-date-in-teaching-week")
    public ResponseEntity<Boolean> isCurrentDateInTeachingWeek() {
        boolean isInTeachingWeek = weekService.isCurrentDateInTeachingWeek();
        return ResponseEntity.ok(isInTeachingWeek);
    }
}