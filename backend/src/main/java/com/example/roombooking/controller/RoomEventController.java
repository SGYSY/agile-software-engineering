package com.example.roombooking.controller;

import com.example.roombooking.dto.RoomEventDTO;
import com.example.roombooking.service.RoomEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-events")
@CrossOrigin(origins = "*")
public class RoomEventController {

    @Autowired
    private RoomEventService roomEventService;
    
    @GetMapping("/room/{roomId}/week/{weekNumber}/day/{dayOfWeek}")
    public ResponseEntity<List<RoomEventDTO>> getRoomEvents(
            @PathVariable Long roomId,
            @PathVariable Integer weekNumber,
            @PathVariable Integer dayOfWeek) {
        List<RoomEventDTO> events = roomEventService.getRoomEvents(roomId, weekNumber, dayOfWeek);
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/room/{roomId}/current-week")
    public ResponseEntity<List<RoomEventDTO>> getCurrentWeekRoomEvents(@PathVariable Long roomId) {
        List<RoomEventDTO> events = roomEventService.getCurrentWeekRoomEvents(roomId);
        return ResponseEntity.ok(events);
    }
}