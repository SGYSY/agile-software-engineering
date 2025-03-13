package com.example.roombooking.controller;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Notification;
import com.example.roombooking.service.BookingService;
import com.example.roombooking.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.getNotificationById(id);
        return notification.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<Notification>> getNotificationsByBooking(@PathVariable Long bookingId) {
        Optional<Booking> booking = bookingService.getBookingById(bookingId);
        if (booking.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        List<Notification> notifications = notificationService.getNotificationsByBooking(booking.get());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Notification>> getPendingNotifications() {
        List<Notification> notifications = notificationService.getPendingNotifications();
        return ResponseEntity.ok(notifications);
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification savedNotification = notificationService.saveNotification(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedNotification);
    }

    @PatchMapping("/{id}/mark-sent")
    public ResponseEntity<Void> markNotificationAsSent(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.getNotificationById(id);
        if (notification.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        notificationService.markNotificationAsSent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/mark-failed")
    public ResponseEntity<Void> markNotificationAsFailed(@PathVariable Long id) {
        Optional<Notification> notification = notificationService.getNotificationById(id);
        if (notification.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        notificationService.markNotificationAsFailed(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        if (notificationService.getNotificationById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}