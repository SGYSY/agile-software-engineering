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

    @Autowired
    private EmailService emailService;

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

    public void deleteNotificationsByBookingId(Long bookingId) {
        // 通过定义一个自定义方法来删除与特定预订关联的所有通知
        notificationRepository.deleteByBookingId(bookingId);
    }

    /**
     * 获取与指定用户预订相关的所有通知
     * @param userId 用户ID
     * @return 通知列表
     */
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByBookingUserId(userId);
    }
    
    // /**
    //  * 获取与指定用户预订相关的通知，并按送达状态筛选
    //  * @param userId 用户ID
    //  * @param sent 送达状态
    //  * @return 通知列表
    //  */
    // public List<Notification> getNotificationsByUserIdAndSent(Long userId, boolean sent) {
    //     return notificationRepository.findByBookingUserIdAndSent(userId, sent);
    // }

    /**
     * 为确认的预订发送邮件通知
     * @param booking 已确认的预订
     */
    public void sendBookingConfirmationEmail(Booking booking) {
        if (booking == null || booking.getUser() == null || booking.getUser().getEmail() == null) {
            return;
        }
        
        String weekAndDayInfo = "第" + booking.getWeekNumber() + "周，星期" + booking.getDayOfWeek();
        String timeInfo = booking.getStartTime() + " 至 " + booking.getEndTime();
        String roomName = booking.getRoom() != null ? booking.getRoom().getName() : "未知房间";
        
        String subject = "预订确认通知 - 房间预订系统";
        String message = "尊敬的 " + booking.getUser().getUsername() + "：\n\n" +
                "您的房间预订已确认！\n\n" +
                "预订详情：\n" +
                "- 房间：" + roomName + "\n" +
                "- 时间：" + weekAndDayInfo + "，" + timeInfo + "\n" +
                "- 状态：已确认\n\n" +
                "如有任何问题，请联系管理员。\n\n" +
                "此致，\n房间预订系统";
        
        // 发送邮件
        emailService.sendEmail(booking.getUser().getEmail(), subject, message);
    }
    
    /**
     * 处理并发送所有待处理的通知
     */
    public void processPendingNotifications() {
        List<Notification> pendingNotifications = getPendingNotifications();
        
        for (Notification notification : pendingNotifications) {
            try {
                if (notification.getBooking() != null && 
                    notification.getBooking().getUser() != null && 
                    notification.getBooking().getUser().getEmail() != null &&
                    notification.getNotificationType() == Notification.NotificationType.email) {
                    
                    // 发送邮件通知
                    emailService.sendEmail(
                        notification.getBooking().getUser().getEmail(),
                        "房间预订系统通知",
                        notification.getMessage()
                    );
                    
                    // 更新通知状态为已发送
                    markNotificationAsSent(notification.getId());
                }
            } catch (Exception e) {
                markNotificationAsFailed(notification.getId());
            }
        }
    }
    
}