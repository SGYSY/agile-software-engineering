package com.example.roombooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
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
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status;
    
    @Column(name = "conflict_detected")
    private Boolean conflictDetected;
    
    @OneToMany(mappedBy = "booking")
    private Set<Notification> notifications;
    
    public enum BookingStatus {
        pending, confirmed, cancelled
    }

    public void setId(Long id){
        this.id = id;
    }

    public Long getId(){
        return this.id;
    }

    public Room getRoom(){
        return this.room;
    }

    public void setRoom(Room room){
        this.room = room;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setConflictDetected(Boolean conflictDetected) {
        this.conflictDetected = conflictDetected;
    }

    public User getUser() {
        return user;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Boolean getConflictDetected() {
        return conflictDetected;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public Set<Notification> getNotifications() {
        return notifications;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setNotifications(Set<Notification> notifications) {
        this.notifications = notifications;
    }
}