package com.example.roombooking.dto;

import java.time.LocalTime;

public class RoomEventDTO {
    
    private Long id;
    private String eventType; // "course" 或 "booking"
    private Long roomId;
    private String roomName;
    private Integer weekNumber;
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String title;
    private String instructor;
    private String groupId;
    private String status; // 预订状态，课程为null
    
    // 构造函数、getter和setter
    public RoomEventDTO() {
    }
    
    // 从课程创建事件
    public static RoomEventDTO fromSchedule(com.example.roombooking.entity.Schedule schedule) {
        RoomEventDTO dto = new RoomEventDTO();
        dto.id = schedule.getId();
        dto.eventType = "course";
        dto.roomId = schedule.getRoom().getId();
        dto.roomName = schedule.getRoom().getName();
        dto.weekNumber = schedule.getWeekNumber();
        dto.dayOfWeek = schedule.getWeekday();
        dto.startTime = schedule.getStartTime();
        dto.endTime = schedule.getEndTime();
        dto.title = schedule.getCourseName();
        dto.instructor = schedule.getInstructor();
        dto.groupId = schedule.getGroupId();
        dto.status = null;
        return dto;
    }
    
    // 从预订创建事件
    public static RoomEventDTO fromBooking(com.example.roombooking.entity.Booking booking) {
        RoomEventDTO dto = new RoomEventDTO();
        dto.id = booking.getId();
        dto.eventType = "booking";
        dto.roomId = booking.getRoom().getId();
        dto.roomName = booking.getRoom().getName();
        dto.weekNumber = booking.getWeekNumber();
        dto.dayOfWeek = booking.getDayOfWeek();
        dto.startTime = booking.getStartTime();
        dto.endTime = booking.getEndTime();
        dto.title = "Booking by " + booking.getUser().getUsername();
        dto.instructor = null;
        dto.groupId = null;
        dto.status = booking.getStatus().name();
        return dto;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Integer getWeekNumber() {
        return weekNumber;
    }

    public void setWeekNumber(Integer weekNumber) {
        this.weekNumber = weekNumber;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}