package com.example.roombooking.service;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Notification;
import com.example.roombooking.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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

    public void createBookingNotification(Booking booking) {
        String weekAndDayInfo = "Week" + booking.getWeekNumber() + ", Weekday is " + booking.getDayOfWeek();
        String timeInfo = booking.getStartTime() + " to " + booking.getEndTime();
        
        // create email notification
        Notification emailNotification = new Notification();
        emailNotification.setBooking(booking);
        emailNotification.setNotificationType(Notification.NotificationType.email);
        emailNotification.setStatus(Notification.NotificationStatus.pending);
        emailNotification.setMessage("Your room reservation status is " + booking.getStatus() + "。" +
                "Room detail: " + booking.getRoom().getName() + "," +
                weekAndDayInfo + "," + timeInfo);
        
        notificationRepository.save(emailNotification);
        
        // create SMS notification
        Notification smsNotification = new Notification();
        smsNotification.setBooking(booking);
        smsNotification.setNotificationType(Notification.NotificationType.sms);
        smsNotification.setStatus(Notification.NotificationStatus.pending);
        smsNotification.setMessage("Your room reservation status is " + booking.getStatus() + ". " +
                "room: " + booking.getRoom().getName() + ", " + weekAndDayInfo);
        
        notificationRepository.save(smsNotification);
    }

    public void createApprovalNotification(Booking booking) {
        String weekAndDayInfo = "Week" + booking.getWeekNumber() + ", weekday is" + booking.getDayOfWeek();
        String timeInfo = booking.getStartTime() + " to " + booking.getEndTime();
        
        // create email notification
        Notification emailNotification = new Notification();
        emailNotification.setBooking(booking);
        emailNotification.setNotificationType(Notification.NotificationType.email);
        emailNotification.setStatus(Notification.NotificationStatus.pending);
        emailNotification.setMessage("Your room reservation is confirmed." +
                "Room detail: " + booking.getRoom().getName() + ", " +
                weekAndDayInfo + ", " + timeInfo);
        
        notificationRepository.save(emailNotification);
        
        // create SMS notification
        Notification smsNotification = new Notification();
        smsNotification.setBooking(booking);
        smsNotification.setNotificationType(Notification.NotificationType.sms);
        smsNotification.setStatus(Notification.NotificationStatus.pending);
        smsNotification.setMessage("Your room reservation is confirmed. room: " + booking.getRoom().getName() + ", " + weekAndDayInfo);
        
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
        notificationRepository.deleteByBookingId(bookingId);
    }

    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByBookingUserId(userId);
    }

    // public List<Notification> getNotificationsByUserIdAndSent(Long userId, boolean sent) {
    //     return notificationRepository.findByBookingUserIdAndSent(userId, sent);
    // }

    public void sendBookingConfirmationEmail(Booking booking) throws UnsupportedEncodingException {
        if (booking == null || booking.getUser() == null || booking.getUser().getEmail() == null) {
            return;
        }
        
        String weekAndDayInfo = "For Week " + booking.getWeekNumber() + ", " + mapNumberToWeekday(booking.getDayOfWeek());
        String timeInfo = booking.getStartTime() + " to " + booking.getEndTime();
        String roomName = booking.getRoom() != null ? booking.getRoom().getName() : "Unknown room";
        String startTime = booking.getStartTime().toString();
        String endTime = booking.getEndTime().toString();
        int weekNumber = booking.getWeekNumber();
        int dayOfWeek = booking.getDayOfWeek();

        String semesterStartDate = "2025-02-17";
        LocalDate semesterStart = LocalDate.parse(semesterStartDate, DateTimeFormatter.ISO_DATE);

        LocalDate targetDate = semesterStart.plusWeeks(weekNumber - 1).plusDays(dayOfWeek - 1);

        String startDateTime = targetDate + "T" + startTime + ":00";
        String endDateTime = targetDate + "T" + endTime + ":00";

        String subject = "Booking confirmation - Room reservation system";
        String body = "Dear " + booking.getUser().getUsername() + ":\n\n" +
                "Your room reservation has been confirmed!\n\n" +
                "Here are the booking details:\n" +
                "- Room: " + roomName + "\n" +
                "- Date and Time: " + targetDate + ", " + timeInfo + "\n" +
                "- State: confirmed\n\n" +
                "If you have any questions, please feel free to contact the administrator.\n\n" +
                "Best regards,\nRoom Reservation System";

        String message = "Dear " + booking.getUser().getUsername() + ":\n\n" +
                "Your room reservation is confirmed!\n\n" +
                "Booking detail:\n" +
                "- Room: " + roomName + "\n" +
                "- Time: " + weekAndDayInfo + "," + timeInfo + "\n" +
                "- State: confirmed\n\n" +
                "If you have any questions, please contact the administrator.\n\n" +
                "To make it easier for you, we’ve generated a link that will allow you to quickly add this reservation to your Outlook calendar." +
                " Simply click the link below, and the details will be pre-filled:\n" +
                "https://outlook.office.com/calendar/0/deeplink/compose?" +
                "subject=" + URLEncoder.encode(subject, "UTF-8") +
                "&startdt=" + URLEncoder.encode(startDateTime, "UTF-8") +
                "&enddt=" + URLEncoder.encode(endDateTime, "UTF-8") +
                "&location=" + URLEncoder.encode(roomName, "UTF-8") +
                "\n\nWith the best wishes,\nRoom reservation system";
        emailService.sendEmail(booking.getUser().getEmail(), subject, message);
    }

    public static String mapNumberToWeekday(int day) {
        switch (day) {
            case 1: return "Monday";
            case 2: return "Tuesday";
            case 3: return "Wednesday";
            case 4: return "Thursday";
            case 5: return "Friday";
            case 6: return "Saturday";
            case 7: return "Sunday";
            default: return "Invalid day";
        }
    }

    public void processPendingNotifications() {
        List<Notification> pendingNotifications = getPendingNotifications();
        
        for (Notification notification : pendingNotifications) {
            try {
                if (notification.getBooking() != null && 
                    notification.getBooking().getUser() != null && 
                    notification.getBooking().getUser().getEmail() != null &&
                    notification.getNotificationType() == Notification.NotificationType.email) {

                    emailService.sendEmail(
                        notification.getBooking().getUser().getEmail(),
                        "Room reservation system notification",
                        notification.getMessage()
                    );

                    markNotificationAsSent(notification.getId());
                }
            } catch (Exception e) {
                markNotificationAsFailed(notification.getId());
            }
        }
    }
    
}