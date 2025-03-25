package com.example.roombooking.service;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.User;
import com.example.roombooking.repository.BookingRepository;
import com.example.roombooking.repository.RoomRepository;
import com.example.roombooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Time;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

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

    @Autowired
    private WeekService weekService;


    @Autowired
    private JdbcTemplate jdbcTemplate;


    @Autowired
    private ScheduleService scheduleService;

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
        Integer currentWeekNumber = weekService.getCurrentWeekNumber();
        return user.map(value -> bookingRepository.findByUserAndWeekNumberGreaterThanEqual(value, currentWeekNumber))
                .orElse(List.of());
    }

    public boolean hasConflict(Long roomId, Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime) {
        List<Booking> existingBookings = bookingRepository.findConflictingBookings(
            roomId, weekNumber, dayOfWeek, startTime, endTime);

        boolean scheduleConflict = scheduleService.hasScheduleConflict(
            roomId, weekNumber, dayOfWeek, startTime, endTime);
        
        return !existingBookings.isEmpty() || scheduleConflict;
    }

    public Booking createBooking(Booking booking) {
        try {
            User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            booking.setUser(user);

            Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
            booking.setRoom(room);
            
            System.out.println("Create booking: " + booking);

            boolean hasConflict = hasConflict(
                room.getId(), 
                booking.getWeekNumber(), 
                booking.getDayOfWeek(),
                booking.getStartTime(), 
                booking.getEndTime()
            );
            
            System.out.println("Conflict detection result: " + hasConflict);
            
            booking.setConflictDetected(hasConflict);

            if (user.getRole() != null && 
                "Student".equals(user.getRole().getName()) && 
                !hasConflict) {
                booking.setStatus(Booking.BookingStatus.pending);
            } else {
                booking.setStatus(Booking.BookingStatus.confirmed);
            }
            
            System.out.println("Set reservation status: " + booking.getStatus());

            // String sql = "INSERT INTO bookings (conflict_detected, day_of_week, end_time, room_id, start_time, status, user_id, week_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            String sql = "INSERT INTO `bookings` " +
            "(`conflict_detected`, `day_of_week`, `end_time`, " +
            "`room_id`, `start_time`, `status`, `user_id`, `week_number`) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setBoolean(1, booking.isConflictDetected());
                ps.setInt(2, booking.getDayOfWeek());
                ps.setTime(3, Time.valueOf(booking.getEndTime()));
                ps.setLong(4, booking.getRoom().getId());
                ps.setTime(5, Time.valueOf(booking.getStartTime()));
                ps.setString(6, booking.getStatus().toString());
                ps.setLong(7, booking.getUser().getId());
                ps.setInt(8, booking.getWeekNumber());
                return ps;
            }, keyHolder);

            Long generatedId = keyHolder.getKey().longValue();
            booking.setId(generatedId);
            
            System.out.println("Reservation saved successfully, ID: " + generatedId);

            try {
                notificationService.createBookingNotification(booking);
            } catch (Exception e) {
                System.err.println("An error occurred while creating the notification: " + e.getMessage());
            }

            if (booking.getStatus() == Booking.BookingStatus.confirmed) {
                notificationService.sendBookingConfirmationEmail(booking);
            }
            
            return booking;
        } catch (Exception e) {
            System.err.println("An error occurred while creating the reservation: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    

    public Booking updateBooking(Booking booking) {
        if (!bookingRepository.existsById(booking.getId())) {
            return null;
        }

        boolean hasConflict = hasConflict(
            booking.getRoom().getId(), 
            booking.getWeekNumber(), 
            booking.getDayOfWeek(),
            booking.getStartTime(), 
            booking.getEndTime()
        );
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

            notificationService.createApprovalNotification(bookingToApprove);

            notificationService.sendBookingConfirmationEmail(bookingToApprove);
            
            return true;
        }
        return false;
    }

    public void deleteBooking(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isPresent()) {
            notificationService.deleteNotificationsByBookingId(id);
            

            bookingRepository.deleteById(id);
        }
    }

    public List<Booking> getBookingsByWeek(Integer weekNumber) {
        return bookingRepository.findByWeekNumber(weekNumber);
    }

    public List<Booking> getBookingsByRoomAndDate(Long roomId, Integer weekNumber, Integer dayOfWeek) {
        return bookingRepository.findByRoomIdAndWeekAndDay(roomId, weekNumber, dayOfWeek);
    }

}