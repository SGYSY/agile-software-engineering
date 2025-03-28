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

    public List<RoomEventDTO> getRoomEvents(Long roomId, Integer weekNumber, Integer dayOfWeek) {
        List<RoomEventDTO> events = new ArrayList<>();

        List<Schedule> schedules = scheduleService.getSchedulesByRoomAndWeekAndDay(roomId, weekNumber, dayOfWeek);
        schedules.forEach(schedule -> events.add(RoomEventDTO.fromSchedule(schedule)));

        List<Booking> bookings = bookingService.getBookingsByRoomAndDate(roomId, weekNumber, dayOfWeek);
        bookings.forEach(booking -> events.add(RoomEventDTO.fromBooking(booking)));

        return events.stream()
                .sorted(Comparator.comparing(RoomEventDTO::getStartTime))
                .collect(Collectors.toList());
    }

    public List<RoomEventDTO> getCurrentWeekRoomEvents(Long roomId) {
        List<RoomEventDTO> events = new ArrayList<>();
        Integer currentWeek = weekService.getCurrentWeekNumber();

        for (int day = 1; day <= 7; day++) {
            events.addAll(getRoomEvents(roomId, currentWeek, day));
        }
        
        return events;
    }
}