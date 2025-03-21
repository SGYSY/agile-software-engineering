package com.example.roombooking.service;

import com.example.roombooking.dto.RoomEventDTO;
import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomEventService {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private WeekService weekService;
    
    /**
     * 获取特定房间、特定周和特定日期的所有事件（包括课程和预订）
     */
    public List<RoomEventDTO> getRoomEvents(Long roomId, Integer weekNumber, Integer dayOfWeek) {
        List<RoomEventDTO> events = new ArrayList<>();
        
        // 获取课程安排
        List<Schedule> schedules = scheduleService.getSchedulesByRoomAndWeekAndDay(roomId, weekNumber, dayOfWeek);
        schedules.forEach(schedule -> events.add(RoomEventDTO.fromSchedule(schedule)));
        
        // 获取预订信息
        List<Booking> bookings = bookingService.getBookingsByRoomAndDate(roomId, weekNumber, dayOfWeek);
        bookings.forEach(booking -> events.add(RoomEventDTO.fromBooking(booking)));
        
        // 按开始时间排序
        return events.stream()
                .sorted(Comparator.comparing(RoomEventDTO::getStartTime))
                .collect(Collectors.toList());
    }
    
    /**
     * 获取特定房间当前周的所有事件
     */
    public List<RoomEventDTO> getCurrentWeekRoomEvents(Long roomId) {
        List<RoomEventDTO> events = new ArrayList<>();
        Integer currentWeek = weekService.getCurrentWeekNumber();
        
        // 获取一周7天的数据
        for (int day = 1; day <= 7; day++) {
            events.addAll(getRoomEvents(roomId, currentWeek, day));
        }
        
        return events;
    }
}