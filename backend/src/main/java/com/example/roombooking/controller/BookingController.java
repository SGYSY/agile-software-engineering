package com.example.roombooking.controller;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.service.BookingService;
import com.example.roombooking.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private WeekService weekService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<Booking>> getBookingsByRoom(@PathVariable Long roomId) {
        List<Booking> bookings = bookingService.getBookingsByRoom(roomId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable String status) {
        try {
            Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status);
            List<Booking> bookings = bookingService.getBookingsByStatus(bookingStatus);
            return ResponseEntity.ok(bookings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}/future")
    public ResponseEntity<List<Booking>> getUserFutureBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserFutureBookings(userId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/week/{weekNumber}")
    public ResponseEntity<List<Booking>> getBookingsByWeek(@PathVariable Integer weekNumber) {
        List<Booking> bookings = bookingService.getBookingsByWeek(weekNumber);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/room/{roomId}/week/{weekNumber}/day/{dayOfWeek}")
    public ResponseEntity<List<Booking>> getBookingsByRoomAndDate(
            @PathVariable Long roomId,
            @PathVariable Integer weekNumber,
            @PathVariable Integer dayOfWeek) {
        List<Booking> bookings = bookingService.getBookingsByRoomAndDate(roomId, weekNumber, dayOfWeek);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/current-week")
    public ResponseEntity<Integer> getCurrentWeek() {
        Integer currentWeek = weekService.getCurrentWeekNumber();
        return ResponseEntity.ok(currentWeek);
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Booking createdBooking = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
        } catch (Exception e) {
            // 返回详细错误信息
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "创建预订失败");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking booking) {
        // make sure ID consistence
        booking.setId(id);
        Booking updatedBooking = bookingService.updateBooking(booking);
        
        if (updatedBooking == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(updatedBooking);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        boolean cancelled = bookingService.cancelBooking(id);
        
        if (!cancelled) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<Void> approveBooking(@PathVariable Long id) {
        boolean approved = bookingService.approveBooking(id);
        
        if (!approved) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (bookingService.getBookingById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBookings(
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Long roomId,
        @RequestParam(required = false) Integer weekNumber,
        @RequestParam(required = false) Integer dayOfWeek,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTimeAfter,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTimeBefore,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Integer timeSlotStart,
        @RequestParam(required = false) Integer timeSlotEnd) {
        
        try {
            System.out.println("搜索预订请求 - userId: " + userId + ", roomId: " + roomId + 
                ", weekNumber: " + weekNumber + ", dayOfWeek: " + dayOfWeek + 
                ", startTimeAfter: " + startTimeAfter + ", endTimeBefore: " + endTimeBefore + 
                ", status: " + status + ", timeSlot: " + timeSlotStart + "-" + timeSlotEnd);
            
            // 初始获取所有预订
            List<Booking> resultBookings = bookingService.getAllBookings();
            int originalCount = resultBookings.size();
            
            // 根据用户ID筛选
            if (userId != null) {
                resultBookings = resultBookings.stream()
                    .filter(booking -> booking.getUser() != null && userId.equals(booking.getUser().getId()))
                    .toList();
                System.out.println("按用户筛选后，还剩 " + resultBookings.size() + " 个预订");
            }
            
            // 根据房间ID筛选
            if (roomId != null) {
                resultBookings = resultBookings.stream()
                    .filter(booking -> booking.getRoom() != null && roomId.equals(booking.getRoom().getId()))
                    .toList();
                System.out.println("按房间筛选后，还剩 " + resultBookings.size() + " 个预订");
            }
            
            // 根据周数筛选
            if (weekNumber != null) {
                resultBookings = resultBookings.stream()
                    .filter(booking -> weekNumber.equals(booking.getWeekNumber()))
                    .toList();
                System.out.println("按周数筛选后，还剩 " + resultBookings.size() + " 个预订");
            }
            
            // 根据星期几筛选
            if (dayOfWeek != null) {
                if (dayOfWeek < 1 || dayOfWeek > 7) {
                    return ResponseEntity.badRequest().body("星期几必须在1-7之间");
                }
                
                resultBookings = resultBookings.stream()
                    .filter(booking -> dayOfWeek.equals(booking.getDayOfWeek()))
                    .toList();
                System.out.println("按星期几筛选后，还剩 " + resultBookings.size() + " 个预订");
            }
            
            // 处理时间段筛选
            if (timeSlotStart != null && timeSlotEnd != null) {
                // 验证时间段参数
                if (timeSlotStart < 1 || timeSlotEnd > 12 || timeSlotStart > timeSlotEnd) {
                    return ResponseEntity.badRequest().body("时间段必须在1-12之间，且起始时间不能大于结束时间");
                }
                
                // 转换时间段为实际时间
                LocalTime startTime = convertTimeSlotToLocalTime(timeSlotStart);
                LocalTime endTime;
                if (timeSlotEnd < 12) {
                    endTime = convertTimeSlotToLocalTime(timeSlotEnd + 1);
                } else {
                    endTime = LocalTime.of(22, 30);
                }
                
                final LocalTime finalStartTime = startTime;
                final LocalTime finalEndTime = endTime;
                
                resultBookings = resultBookings.stream()
                    .filter(booking -> {
                        // 检查预订时间是否与搜索时间段重叠
                        LocalTime bookingStart = booking.getStartTime();
                        LocalTime bookingEnd = booking.getEndTime();
                        return (bookingStart.isBefore(finalEndTime) && bookingEnd.isAfter(finalStartTime)) ||
                            bookingStart.equals(finalStartTime) || bookingEnd.equals(finalEndTime);
                    })
                    .toList();
                System.out.println("按时间段筛选后，还剩 " + resultBookings.size() + " 个预订");
            } else {
                // 如果提供了精确的开始或结束时间
                if (startTimeAfter != null) {
                    resultBookings = resultBookings.stream()
                        .filter(booking -> booking.getStartTime().isAfter(startTimeAfter) || 
                                        booking.getStartTime().equals(startTimeAfter))
                        .toList();
                    System.out.println("按开始时间筛选后，还剩 " + resultBookings.size() + " 个预订");
                }
                
                if (endTimeBefore != null) {
                    resultBookings = resultBookings.stream()
                        .filter(booking -> booking.getEndTime().isBefore(endTimeBefore) || 
                                        booking.getEndTime().equals(endTimeBefore))
                        .toList();
                    System.out.println("按结束时间筛选后，还剩 " + resultBookings.size() + " 个预订");
                }
            }
            
            // 根据状态筛选
            if (status != null && !status.isEmpty()) {
                try {
                    Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status.toLowerCase());
                    resultBookings = resultBookings.stream()
                        .filter(booking -> bookingStatus.equals(booking.getStatus()))
                        .toList();
                    System.out.println("按状态筛选后，还剩 " + resultBookings.size() + " 个预订");
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("无效的预订状态: " + status + 
                        "。有效值为: pending, confirmed, cancelled");
                }
            }
            
            System.out.println("总计从 " + originalCount + " 个预订过滤到 " + resultBookings.size() + " 个预订");
            return ResponseEntity.ok(resultBookings);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("搜索失败: " + e.getMessage());
        }
    }

    // 从RoomController复制的时间段转换方法
    private LocalTime convertTimeSlotToLocalTime(Integer timeSlot) {
        switch (timeSlot) {
            case 1: return LocalTime.of(8, 0);
            case 2: return LocalTime.of(8, 55);
            case 3: return LocalTime.of(10, 0);
            case 4: return LocalTime.of(10, 55);
            case 5: return LocalTime.of(14, 0);
            case 6: return LocalTime.of(14, 55);
            case 7: return LocalTime.of(16, 0);
            case 8: return LocalTime.of(16, 55);
            case 9: return LocalTime.of(19, 0);
            case 10: return LocalTime.of(19, 55);
            case 11: return LocalTime.of(20, 50);
            case 12: return LocalTime.of(21, 45);
            default: throw new IllegalArgumentException("无效的时间段编号: " + timeSlot);
        }
    }
    
}