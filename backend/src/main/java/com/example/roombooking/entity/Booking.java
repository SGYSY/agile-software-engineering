package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;
import java.util.Set;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    
    @Column(name = "start_time")
    private LocalTime startTime;
    
    @Column(name = "end_time")
    private LocalTime endTime;
    
    @Column(name = "week_number")
    private Integer weekNumber;
    
    @Column(name = "day_of_week")
    private Integer dayOfWeek;
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    
    @Column(name = "conflict_detected")
    private Boolean conflictDetected;
    
    @OneToMany(mappedBy = "booking")
    @JsonIgnore
    private Set<Notification> notifications;
    
    public enum BookingStatus {
        pending, confirmed, cancelled
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Room getRoom() {
        return room;
    }
    
    public void setRoom(Room room) {
        this.room = room;
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
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public Boolean getConflictDetected() {
        return conflictDetected;
    }
    
    public void setConflictDetected(Boolean conflictDetected) {
        this.conflictDetected = conflictDetected;
    }
    
    public Set<Notification> getNotifications() {
        return notifications;
    }
    
    public void setNotifications(Set<Notification> notifications) {
        this.notifications = notifications;
    }
    
    // equals, hashCode and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Booking booking = (Booking) o;
        return id != null && id.equals(booking.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return "Booking{" +
               "id=" + id +
               ", weekNumber=" + weekNumber +
               ", dayOfWeek=" + dayOfWeek +
               ", startTime=" + startTime +
               ", endTime=" + endTime +
               ", status=" + status +
               ", conflictDetected=" + conflictDetected +
               '}';
    }

    public boolean isConflictDetected() {
        return conflictDetected;
    }
}