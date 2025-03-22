package com.example.roombooking.controller;

import com.example.roombooking.entity.Booking;
import com.example.roombooking.service.BookingService;
import com.example.roombooking.service.WeekService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}