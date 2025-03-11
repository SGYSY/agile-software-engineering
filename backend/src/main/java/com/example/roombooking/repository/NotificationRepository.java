package com.example.roombooking.repository;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByBooking(Booking booking);
    List<Notification> findByStatus(Notification.NotificationStatus status);
}