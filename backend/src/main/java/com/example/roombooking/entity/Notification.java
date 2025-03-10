package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type")
    private NotificationType notificationType;
    
    private String message;
    
    @Enumerated(EnumType.STRING)
    private NotificationStatus status;
    
    public enum NotificationType {
        email, sms
    }
    
    public enum NotificationStatus {
        sent, pending, failed
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Long getId() {
        return id;
    }

    public Booking getBooking() {
        return booking;
    }

    public String getMessage() {
        return message;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }
}