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

    // 仅更新相关方法，不修改整个类

    public void createBookingNotification(Booking booking) {
        String weekAndDayInfo = "周" + booking.getWeekNumber() + "，星期" + booking.getDayOfWeek();
        String timeInfo = booking.getStartTime() + " 至 " + booking.getEndTime();
        
        // create email notification
        Notification emailNotification = new Notification();
        emailNotification.setBooking(booking);
        emailNotification.setNotificationType(Notification.NotificationType.email);
        emailNotification.setStatus(Notification.NotificationStatus.pending);
        emailNotification.setMessage("您的房间预订状态为 " + booking.getStatus() + "。" +
                "房间详情: " + booking.getRoom().getName() + "，" +
                weekAndDayInfo + "，" + timeInfo);
        
        notificationRepository.save(emailNotification);
        
        // create SMS notification
        Notification smsNotification = new Notification();
        smsNotification.setBooking(booking);
        smsNotification.setNotificationType(Notification.NotificationType.sms);
        smsNotification.setStatus(Notification.NotificationStatus.pending);
        smsNotification.setMessage("您的房间预订状态为 " + booking.getStatus() + "。" +
                "房间: " + booking.getRoom().getName() + ", " + weekAndDayInfo);
        
        notificationRepository.save(smsNotification);
    }

    public void createApprovalNotification(Booking booking) {
        String weekAndDayInfo = "周" + booking.getWeekNumber() + "，星期" + booking.getDayOfWeek();
        String timeInfo = booking.getStartTime() + " 至 " + booking.getEndTime();
        
        // create email notification
        Notification emailNotification = new Notification();
        emailNotification.setBooking(booking);
        emailNotification.setNotificationType(Notification.NotificationType.email);
        emailNotification.setStatus(Notification.NotificationStatus.pending);
        emailNotification.setMessage("您的房间预订已确认。" +
                "房间详情: " + booking.getRoom().getName() + "，" +
                weekAndDayInfo + "，" + timeInfo);
        
        notificationRepository.save(emailNotification);
        
        // create SMS notification
        Notification smsNotification = new Notification();
        smsNotification.setBooking(booking);
        smsNotification.setNotificationType(Notification.NotificationType.sms);
        smsNotification.setStatus(Notification.NotificationStatus.pending);
        smsNotification.setMessage("您的房间预订已确认。房间: " + booking.getRoom().getName() + ", " + weekAndDayInfo);
        
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