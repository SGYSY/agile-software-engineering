package com.example.roombooking.controller;

import com.example.roombooking.entity.Log;
import com.example.roombooking.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class LogController {
    
    @Autowired
    private LogService logService;
    
    @GetMapping
    public ResponseEntity<List<Log>> getAllLogs() {
        return ResponseEntity.ok(logService.getAllLogs());
    }
    
    @GetMapping("/type/{bookType}")
    public ResponseEntity<List<Log>> getLogsByType(@PathVariable String bookType) {
        return ResponseEntity.ok(logService.getLogsByType(bookType));
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Log>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(logService.getLogsByDateRange(startDate, endDate));
    }
    
    @PostMapping
    public ResponseEntity<?> createLog(@RequestBody Map<String, String> request) {
        String bookType = request.get("bookType");
        String bookingData = request.get("bookingData");
        
        logService.createLog(bookType, bookingData);
        return ResponseEntity.ok().build();
    }
}