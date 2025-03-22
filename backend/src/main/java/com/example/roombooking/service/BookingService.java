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
    private WeekService weekService;  // 假设有一个服务来处理周次信息


    @Autowired
    private JdbcTemplate jdbcTemplate;


    // 在 BookingService 类中添加一个 ScheduleService 依赖
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

    // 修改 hasConflict 方法以同时检查预订冲突和课程表冲突
    public boolean hasConflict(Long roomId, Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime) {
        // 1. 检查与其他预订的冲突
        List<Booking> existingBookings = bookingRepository.findConflictingBookings(
            roomId, weekNumber, dayOfWeek, startTime, endTime);
        
        // 2. 检查与课程表的冲突
        boolean scheduleConflict = scheduleService.hasScheduleConflict(
            roomId, weekNumber, dayOfWeek, startTime, endTime);
        
        return !existingBookings.isEmpty() || scheduleConflict;
    }

    public Booking createBooking(Booking booking) {
        try {
            // 1. 首先加载完整的用户信息，包括角色
            User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            booking.setUser(user);
            
            // 2. 加载完整的房间信息
            Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
            booking.setRoom(room);
            
            System.out.println("创建预订: " + booking); 
            
            // 3. 检测时间冲突
            boolean hasConflict = hasConflict(
                room.getId(), 
                booking.getWeekNumber(), 
                booking.getDayOfWeek(),
                booking.getStartTime(), 
                booking.getEndTime()
            );
            
            System.out.println("冲突检测结果: " + hasConflict);
            
            booking.setConflictDetected(hasConflict);
            
            // 4. 设置预订状态
            if (user.getRole() != null && 
                "Administrator".equals(user.getRole().getName()) && 
                !hasConflict) {
                booking.setStatus(Booking.BookingStatus.confirmed);
            } else {
                booking.setStatus(Booking.BookingStatus.pending);
            }
            
            System.out.println("设置预订状态: " + booking.getStatus());

            // 5. 使用JDBC直接插入而不是JPA
            // String sql = "INSERT INTO bookings (conflict_detected, day_of_week, end_time, room_id, start_time, status, user_id, week_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            // 修改 SQL 插入语句，确保字段名称正确且有反引号
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
            
            // 获取生成的ID
            Long generatedId = keyHolder.getKey().longValue();
            booking.setId(generatedId);
            
            System.out.println("保存预订成功，ID: " + generatedId);
            
            // 6. 创建通知
            try {
                notificationService.createBookingNotification(booking);
            } catch (Exception e) {
                System.err.println("创建通知时出错: " + e.getMessage());
            }
            
            return booking;
        } catch (Exception e) {
            System.err.println("创建预订时发生错误: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Booking updateBooking(Booking booking) {
        // 检查是否存在此预订
        if (!bookingRepository.existsById(booking.getId())) {
            return null;
        }
        
        // 如果修改了时间，需要重新检查冲突
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
            
            // 创建确认通知
            notificationService.createApprovalNotification(bookingToApprove);
            
            return true;
        }
        return false;
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
    
    // 获取特定周的预订
    public List<Booking> getBookingsByWeek(Integer weekNumber) {
        return bookingRepository.findByWeekNumber(weekNumber);
    }
    
    // 获取特定房间在特定周和日期的预订
    public List<Booking> getBookingsByRoomAndDate(Long roomId, Integer weekNumber, Integer dayOfWeek) {
        return bookingRepository.findByRoomIdAndWeekAndDay(roomId, weekNumber, dayOfWeek);
    }

}