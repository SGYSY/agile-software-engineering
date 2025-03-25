package com.example.roombooking.controller;

import com.example.roombooking.entity.Room;
import com.example.roombooking.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/capacity/{capacity}")
    public ResponseEntity<List<Room>> getRoomsByMinCapacity(@PathVariable int capacity) {
        return ResponseEntity.ok(roomService.getRoomsByMinCapacity(capacity));
    }

    // @GetMapping("/available-between")
    // public ResponseEntity<List<Room>> getAvailableRoomsBetween(
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
    //         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
    //     return ResponseEntity.ok(roomService.getAvailableRoomsBetween(start, end));
    // }

    @GetMapping("/available-between")
    public ResponseEntity<?> getAvailableRoomsBetween(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        try {
            // Verify Parameters
            if (start.isAfter(end)) {
                return ResponseEntity.badRequest().body("Start time cannot be later than the ending time");
            }
            
            // log for debug
            System.out.println("Search available room - start time: " + start + ", end time: " + end);
            
            List<Room> rooms = roomService.getAvailableRoomsBetween(start, end);
            
            System.out.println("Found " + rooms.size() + " available rooms");
            
            return ResponseEntity.ok(rooms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Search failure: " + e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room createdRoom = roomService.saveRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoom);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        if (roomService.getRoomById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        room.setId(id);
        Room updatedRoom = roomService.saveRoom(room);
        return ResponseEntity.ok(updatedRoom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        if (roomService.getRoomById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-with-capacity")
    public ResponseEntity<?> getAvailableRoomsWithCapacity(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
        @RequestParam(required = false) Integer capacity) {
        try {
            System.out.println("Search request received - start: " + start + ", end: " + end + ", capacity: " + capacity);

            if (start == null && end == null && capacity == null) {
                List<Room> allRooms = roomService.getAllRooms();
                System.out.println("No search criteria provided. Returning all " + allRooms.size() + " rooms");
                return ResponseEntity.ok(allRooms);
            }
            
            List<Room> resultRooms;

            if (start != null && end != null) {
                if (start.isAfter(end)) {
                    return ResponseEntity.badRequest().body("Start time cannot be later than the ending time");
                }

                resultRooms = roomService.getAvailableRoomsBetween(start, end);
                System.out.println("Found " + resultRooms.size() + " rooms available between " + start + " and " + end);
            } else if (start != null || end != null) {
                return ResponseEntity.badRequest().body("Both start and end times must be provided for time-based queries");
            } else {
                resultRooms = roomService.getAllRooms();
            }

            if (capacity != null) {
                if (capacity <= 0) {
                    return ResponseEntity.badRequest().body("Capacity must be greater than zero");
                }
                
                final List<Room> roomsBeforeFilter = resultRooms;
                resultRooms = resultRooms.stream()
                    .filter(room -> room.getCapacity() >= capacity)
                    .toList();
                
                System.out.println("Filtered from " + roomsBeforeFilter.size() + " to " + 
                    resultRooms.size() + " rooms with minimum capacity of " + capacity);
            }
            
            return ResponseEntity.ok(resultRooms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Search failure: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRooms(
        @RequestParam(required = false) Integer weekNumber,
        @RequestParam(required = false) Integer dayOfWeek,
        @RequestParam(required = false) Integer timeSlotStart,
        @RequestParam(required = false) Integer timeSlotEnd,
        @RequestParam(required = false) String roomName,
        @RequestParam(required = false) Integer minCapacity) {
        
        try {
            System.out.println("Search room requirement - weekNumber: " + weekNumber + ", dayOfWeek: " + dayOfWeek +
                ", timeSlot: " + timeSlotStart + "-" + timeSlotEnd + 
                ", roomName: " + roomName + ", minCapacity: " + minCapacity);

            List<Room> resultRooms = roomService.getAllRooms();
            int originalCount = resultRooms.size();

            if (roomName != null && !roomName.trim().isEmpty()) {
                final String searchName = roomName.toLowerCase().trim();
                resultRooms = resultRooms.stream()
                    .filter(room -> room.getName() != null && room.getName().toLowerCase().contains(searchName))
                    .toList();
                System.out.println("After filtering by user name " + resultRooms.size() + " left");
            }

            if (minCapacity != null && minCapacity > 0) {
                resultRooms = resultRooms.stream()
                    .filter(room -> room.getCapacity() >= minCapacity)
                    .toList();
                System.out.println("After filtering by capacity " + resultRooms.size() + " left");
            }

            if (weekNumber != null && dayOfWeek != null && timeSlotStart != null && timeSlotEnd != null) {
                if (dayOfWeek < 1 || dayOfWeek > 7) {
                    return ResponseEntity.badRequest().body("The day of the week must be between 1 and 7");
                }
                
                if (timeSlotStart < 1 || timeSlotEnd > 12 || timeSlotStart > timeSlotEnd) {
                    return ResponseEntity.badRequest().body("The time slot must be between 1 and 12, and the start time cannot be greater than the end time.");
                }

                LocalTime startTime = convertTimeSlotToLocalTime(timeSlotStart);
                LocalTime endTime;
                if (timeSlotEnd < 12) {
                    endTime = convertTimeSlotToLocalTime(timeSlotEnd + 1);
                } else {
                    endTime = LocalTime.of(22, 30);
                }

                List<Room> availableRooms = new ArrayList<>();

                List<Long> roomIds = resultRooms.stream()
                    .map(Room::getId)
                    .collect(Collectors.toList());
                
                if (!roomIds.isEmpty()) {
                    List<Long> availableRoomIds = roomService.getAvailableRoomIdsByTimeSlot(
                        weekNumber, dayOfWeek, startTime, endTime, roomIds);
                    
                    if (availableRoomIds.isEmpty()) {
                        System.out.println("No available rooms in the specified time slot");
                        return ResponseEntity.ok(new ArrayList<Room>());
                    }

                    resultRooms = resultRooms.stream()
                        .filter(room -> availableRoomIds.contains(room.getId()))
                        .toList();
                    
                    System.out.println("After filtering by time slot " + resultRooms.size() + " left");
                }
            }
            
            System.out.println("Total " + originalCount + " room(s) after filtering " + resultRooms.size() + " left");
            return ResponseEntity.ok(resultRooms);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Search failed: " + e.getMessage());
        }
    }
    
    /**
     * 1: 8:00-8:45
     * 2: 8:55-9:40
     * 3: 10:00-10:45
     * 4: 10:55-11:40
     * 5: 14:00-14:45
     * 6: 14:55-15:40
     * 7: 16:00-16:45
     * 8: 16:55-17:40
     * 9: 19:00-19:45
     * 10: 19:55-20:40
     * 11: 20:50-21:35
     * 12: 21:45-22:30
     */
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
            default: throw new IllegalArgumentException("Invalid time slot number: " + timeSlot);
        }
    }
}