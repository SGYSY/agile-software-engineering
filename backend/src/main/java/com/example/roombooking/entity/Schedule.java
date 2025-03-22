package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "schedule")
@Data
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    
    @Column(name = "week_number")
    private Integer weekNumber;
    
    @Column(name = "weekday")
    private Integer weekday;
    
    @Column(name = "period")
    private Integer period;
    
    @Column(name = "start_time")
    private LocalTime startTime;
    
    @Column(name = "end_time")
    private LocalTime endTime;
    
    @Column(name = "course_name")
    private String courseName;
    
    @Column(name = "instructor")
    private String instructor;
    
    @Column(name = "group_id")
    private String groupId;

    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Room getRoom() {
        return room;
    }
    
    public void setRoom(Room room) {
        this.room = room;
    }
    
    public Integer getWeekNumber() {
        return weekNumber;
    }
    
    public void setWeekNumber(Integer weekNumber) {
        this.weekNumber = weekNumber;
    }
    
    public Integer getWeekday() {
        return weekday;
    }
    
    public void setWeekday(Integer weekday) {
        this.weekday = weekday;
    }
    
    public Integer getPeriod() {
        return period;
    }
    
    public void setPeriod(Integer period) {
        this.period = period;
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
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
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
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Schedule schedule = (Schedule) o;
        return id != null && id.equals(schedule.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return "Schedule{" +
               "id=" + id +
               ", weekNumber=" + weekNumber +
               ", weekday=" + weekday +
               ", period=" + period +
               ", startTime=" + startTime +
               ", endTime=" + endTime +
               ", courseName='" + courseName + '\'' +
               ", instructor='" + instructor + '\'' +
               ", groupId='" + groupId + '\'' +
               '}';
    }
}