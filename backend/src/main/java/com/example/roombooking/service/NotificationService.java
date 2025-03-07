package com.example.roombooking.service;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Notification;
import com.example.roombooking.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByBooking(Booking booking) {
        return notificationRepository.findByBooking(booking);
    }

    public List<Notification> getPendingNotifications() {
        return notificationRepository.findByStatus(Notification.NotificationStatus.pending);
    }

    public void createBookingNotification(Booking booking) {
        // 创建邮件通知
        Notification emailNotification = new Notification();
        emailNotification.setBooking(booking);
        emailNotification.setNotificationType(Notification.NotificationType.email);
        emailNotification.setStatus(Notification.NotificationStatus.pending);
        emailNotification.setMessage("Your room booking has been " + booking.getStatus() + ". " +
                "Room details: " + booking.getRoom().getName() + ", " +
                "from " + booking.getStartTime() + " to " + booking.getEndTime() + ".");
        
        notificationRepository.save(emailNotification);
        
        // 创建短信通知
        Notification smsNotification = new Notification();
        smsNotification.setBooking(booking);
        smsNotification.setNotificationType(Notification.NotificationType.sms);
        smsNotification.setStatus(Notification.NotificationStatus.pending);
        smsNotification.setMessage("Your room booking has been " + booking.getStatus() + ". " +
                "Room: " + booking.getRoom().getName());
        
        notificationRepository.save(smsNotification);
    }

    public void createApprovalNotification(Booking booking) {
        // 创建邮件通知
        Notification emailNotification = new Notification();
        emailNotification.setBooking(booking);
        emailNotification.setNotificationType(Notification.NotificationType.email);
        emailNotification.setStatus(Notification.NotificationStatus.pending);
        emailNotification.setMessage("Your room booking has been confirmed. " +
                "Room details: " + booking.getRoom().getName() + ", " +
                "from " + booking.getStartTime() + " to " + booking.getEndTime() + ".");
        
        notificationRepository.save(emailNotification);
        
        // 创建短信通知
        Notification smsNotification = new Notification();
        smsNotification.setBooking(booking);
        smsNotification.setNotificationType(Notification.NotificationType.sms);
        smsNotification.setStatus(Notification.NotificationStatus.pending);
        smsNotification.setMessage("Your room booking has been confirmed. " +
                "Room: " + booking.getRoom().getName());
        
        notificationRepository.save(smsNotification);
    }

    public void markNotificationAsSent(Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification n = notification.get();
            n.setStatus(Notification.NotificationStatus.sent);
            notificationRepository.save(n);
        }
    }

    public void markNotificationAsFailed(Long id) {
        Optional<Notification> notification = notificationRepository.findById(id);
        if (notification.isPresent()) {
            Notification n = notification.get();
            n.setStatus(Notification.NotificationStatus.failed);
            notificationRepository.save(n);
        }
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}