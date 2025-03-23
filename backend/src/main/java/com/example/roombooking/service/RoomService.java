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

    // 修改这个方法以使用新的数据结构
    public List<Room> getAvailableRoomsBetween(LocalDateTime start, LocalDateTime end) {
        // 1. 从 LocalDateTime 提取周数、星期几和时间
        Integer weekNumber = weekService.getWeekNumberForDate(start.toLocalDate());
        Integer dayOfWeek = start.getDayOfWeek().getValue(); // 1-7 对应周一到周日
        
        Time startTime = Time.valueOf(start.toLocalTime());
        Time endTime = Time.valueOf(end.toLocalTime());
        
        // 2. 使用新的查询方法
        return roomRepository.findAvailableRoomsByWeekAndDay(weekNumber, dayOfWeek, startTime, endTime);
    }

    
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    // /**
    //  * 获取指定时间段内可用的房间ID列表
    //  * @param weekNumber 周数
    //  * @param dayOfWeek 星期几(1-7)
    //  * @param startTime 开始时间
    //  * @param endTime 结束时间
    //  * @return 可用房间ID列表
    //  */
    // public List<Long> getAvailableRoomIdsByTimeSlot(
    //         Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime) {
        
    //     // 转换为SQL可用的Time类型
    //     Time sqlStartTime = Time.valueOf(startTime);
    //     Time sqlEndTime = Time.valueOf(endTime);
        
    //     // 查询在指定时间段没有课程安排和预订的房间ID
    //     return roomRepository.findAvailableRoomIdsByTimeSlot(
    //         weekNumber, dayOfWeek, sqlStartTime, sqlEndTime);
    // }

        /**
     * 获取指定时间段内可用的房间ID列表
     * @param weekNumber 周数
     * @param dayOfWeek 星期几(1-7)
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param roomIds 需要检查的房间ID列表
     * @return 可用房间ID列表
     */
    public List<Long> getAvailableRoomIdsByTimeSlot(
            Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime, List<Long> roomIds) {
        
        if (roomIds == null || roomIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 转换为SQL可用的Time类型
        Time sqlStartTime = Time.valueOf(startTime);
        Time sqlEndTime = Time.valueOf(endTime);
        
        // 查询在指定时间段没有课程安排和预订的房间ID
        return roomRepository.findAvailableRoomIdsByTimeSlot(
            weekNumber, dayOfWeek, sqlStartTime, sqlEndTime, roomIds);
    }
}