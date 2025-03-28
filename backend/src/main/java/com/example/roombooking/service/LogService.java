package com.example.roombooking.service;

import com.example.roombooking.entity.Log;
import com.example.roombooking.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LogService {
    
    @Autowired
    private LogRepository logRepository;
    
    public List<Log> getAllLogs() {
        return logRepository.findAll();
    }
    
    public List<Log> getLogsByType(String bookType) {
        return logRepository.findByBookType(bookType);
    }
    
    public List<Log> getLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return logRepository.findByBookingDateBetween(startDate, endDate);
    }
    
    @Transactional
    public void createLog(String bookType, String bookingData) {
        logRepository.createLog(bookType, bookingData);
    }
    
    public void logRoomUsage(String roomInfo) {
        createLog("usage", roomInfo);
    }
    
    public void logCancellation(String cancellationInfo) {
        createLog("cancellation", cancellationInfo);
    }
    
    public void logUtilization(String utilizationInfo) {
        createLog("utilization", utilizationInfo);
    }
}