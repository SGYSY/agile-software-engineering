package com.example.roombooking.controller;

import com.example.roombooking.entity.Week;
import com.example.roombooking.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/common")
@CrossOrigin(origins = "*")
public class CommonController {

    @Autowired
    private WeekService weekService;
    
    @GetMapping("/current-teaching-week")
    public ResponseEntity<Map<String, Object>> getCurrentTeachingWeek() {
        Map<String, Object> response = new HashMap<>();
        
        Integer weekNumber = weekService.getCurrentWeekNumber();
        response.put("weekNumber", weekNumber);
        
        if (weekNumber > 0) {
            Optional<Week> currentWeek = weekService.getWeekByNumber(weekNumber);
            if (currentWeek.isPresent()) {
                Week week = currentWeek.get();
                response.put("startDate", week.getStartDate());
                response.put("endDate", week.getEndDate());
                response.put("description", week.getDescription());
                response.put("isTeachingWeek", true);
            }
        } else {
            response.put("isTeachingWeek", false);
        }
        
        return ResponseEntity.ok(response);
    }
}