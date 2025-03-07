package com.example.roombooking.service;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.User;
import com.example.roombooking.repository.BookingRepository;
import com.example.roombooking.repository.RoomRepository;
import com.example.roombooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private NotificationService notificationService;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> bookingRepository.findByUser(value)).orElse(List.of());
    }

    public List<Booking> getBookingsByRoom(Long roomId) {
        Optional<Room> room = roomRepository.findById(roomId);
        return room.map(value -> bookingRepository.findByRoom(value)).orElse(List.of());
    }

    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> getUserFutureBookings(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> bookingRepository.findByUserAndStartTimeAfter(value, LocalDateTime.now()))
                .orElse(List.of());
    }

    public boolean hasConflict(Long roomId, LocalDateTime start, LocalDateTime end) {
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(roomId, start, end);
        return !conflictingBookings.isEmpty();
    }

    public Booking createBooking(Booking booking) {
        boolean hasConflict = hasConflict(booking.getRoom().getId(), booking.getStartTime(), booking.getEndTime());
        booking.setConflictDetected(hasConflict);
        
        // 如果是管理员创建的预订，或者没有冲突，则自动确认
        if (booking.getUser().getRole().getName().equals("Administrator") || !hasConflict) {
            booking.setStatus(Booking.BookingStatus.confirmed);
        } else {
            booking.setStatus(Booking.BookingStatus.pending);
        }
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // 创建通知
        notificationService.createBookingNotification(savedBooking);
        
        return savedBooking;
    }

    public Booking updateBooking(Booking booking) {
        // 检查是否存在此预订
        if (!bookingRepository.existsById(booking.getId())) {
            return null;
        }
        
        // 如果修改了时间，需要重新检查冲突
        boolean hasConflict = hasConflict(booking.getRoom().getId(), booking.getStartTime(), booking.getEndTime());
        booking.setConflictDetected(hasConflict);
        
        return bookingRepository.save(booking);
    }

    public boolean cancelBooking(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            Booking bookingToCancel = booking.get();
            bookingToCancel.setStatus(Booking.BookingStatus.cancelled);
            bookingRepository.save(bookingToCancel);
            return true;
        }
        return false;
    }

    public boolean approveBooking(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            Booking bookingToApprove = booking.get();
            bookingToApprove.setStatus(Booking.BookingStatus.confirmed);
            bookingRepository.save(bookingToApprove);
            
            // 创建确认通知
            notificationService.createApprovalNotification(bookingToApprove);
            
            return true;
        }
        return false;
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}