package com.example.roombooking.repository;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByBooking(Booking booking);
    List<Notification> findByStatus(Notification.NotificationStatus status);

    @Modifying
    @Transactional
    @Query("DELETE FROM Notification n WHERE n.booking.id = :bookingId")
    void deleteByBookingId(@Param("bookingId") Long bookingId);

    // // 查询与特定用户的预订相关的所有通知
    // @Query("SELECT n FROM Notification n JOIN n.booking b WHERE b.user.id = :userId ORDER BY n.timestamp DESC")
    // 使用原生SQL查询更灵活地处理两表交集
    @Query(value = "SELECT n.* FROM notifications n " +
            "JOIN bookings b ON n.booking_id = b.booking_id " +
            "WHERE b.user_id = :userId " +
            "ORDER BY n.notification_id DESC", nativeQuery = true)
    List<Notification> findByBookingUserId(@Param("userId") Long userId);
    
    // // 查询与特定用户的预订相关的通知，并按送达状态筛选
    // @Query("SELECT n FROM Notification n JOIN n.booking b WHERE b.user.id = :userId AND n.sent = :sent ORDER BY n.timestamp DESC")
    // List<Notification> findByBookingUserIdAndSent(@Param("userId") Long userId, @Param("sent") boolean sent);

    
}