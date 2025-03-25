package com.example.roombooking.service;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Room;
import com.example.roombooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private WeekService weekService;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailableTrue();
    }

    public List<Room> getRoomsByMinCapacity(int capacity) {
        return roomRepository.findByCapacityGreaterThanEqual(capacity);
    }


    // public List<Room> getAvailableRoomsBetween(LocalDateTime start, LocalDateTime end) {
    //     String startStr = start.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    //     String endStr = end.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    //     return roomRepository.findAvailableRooms(startStr, endStr);
    // }

    public List<Room> getAvailableRoomsBetween(LocalDateTime start, LocalDateTime end) {
        Integer weekNumber = weekService.getWeekNumberForDate(start.toLocalDate());
        Integer dayOfWeek = start.getDayOfWeek().getValue();
        
        Time startTime = Time.valueOf(start.toLocalTime());
        Time endTime = Time.valueOf(end.toLocalTime());

        return roomRepository.findAvailableRoomsByWeekAndDay(weekNumber, dayOfWeek, startTime, endTime);
    }

    
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    // public List<Long> getAvailableRoomIdsByTimeSlot(
    //         Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime) {

    //     Time sqlStartTime = Time.valueOf(startTime);
    //     Time sqlEndTime = Time.valueOf(endTime);

    //     return roomRepository.findAvailableRoomIdsByTimeSlot(
    //         weekNumber, dayOfWeek, sqlStartTime, sqlEndTime);
    // }

    public List<Long> getAvailableRoomIdsByTimeSlot(
            Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime, List<Long> roomIds) {
        
        if (roomIds == null || roomIds.isEmpty()) {
            return new ArrayList<>();
        }

        Time sqlStartTime = Time.valueOf(startTime);
        Time sqlEndTime = Time.valueOf(endTime);

        return roomRepository.findAvailableRoomIdsByTimeSlot(
            weekNumber, dayOfWeek, sqlStartTime, sqlEndTime, roomIds);
    }
}