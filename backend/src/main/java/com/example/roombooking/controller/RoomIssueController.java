package com.example.roombooking.controller;

import com.example.roombooking.entity.RoomIssue;
import com.example.roombooking.service.RoomIssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/room-issues")
@CrossOrigin(origins = "*")
public class RoomIssueController {

    @Autowired
    private RoomIssueService roomIssueService;
    
    @GetMapping
    public ResponseEntity<List<RoomIssue>> getAllIssues() {
        return ResponseEntity.ok(roomIssueService.getAllIssues());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RoomIssue> getIssueById(@PathVariable Long id) {
        Optional<RoomIssue> issue = roomIssueService.getIssueById(id);
        return issue.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<RoomIssue>> getIssuesByRoom(@PathVariable Long roomId) {
        List<RoomIssue> issues = roomIssueService.getIssuesByRoom(roomId);
        return ResponseEntity.ok(issues);
    }
    
    @GetMapping("/room/{roomId}/count")
    public ResponseEntity<Integer> getIssueCountByRoom(@PathVariable Long roomId) {
        int count = roomIssueService.getIssueCountByRoom(roomId);
        return ResponseEntity.ok(count);
    }
    
    @PostMapping
    public ResponseEntity<RoomIssue> reportIssue(@RequestBody RoomIssue issue) {
        RoomIssue createdIssue = roomIssueService.reportIssue(issue);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIssue);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RoomIssue> updateIssue(@PathVariable Long id, @RequestBody RoomIssue issue) {
        RoomIssue updatedIssue = roomIssueService.updateIssue(id, issue);
        if (updatedIssue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedIssue);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        if (roomIssueService.getIssueById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        roomIssueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }

    // Mark room as maintenance
    @PatchMapping("/room/{roomId}/maintenance")
    public ResponseEntity<?> markRoomUnderMaintenance(
            @PathVariable Long roomId,
            @RequestBody Map<String, String> requestBody) {
        
        String issueName = requestBody.get("issueName");
        String description = requestBody.get("description");
        
        boolean success = roomIssueService.markRoomUnderMaintenance(roomId, issueName, description);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of(
                "message", "Room marked as under maintenance",
                "roomId", roomId
            ));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Mark room as available
    @PatchMapping("/room/{roomId}/available")
    public ResponseEntity<?> markRoomAvailable(@PathVariable Long roomId) {
        boolean success = roomIssueService.markRoomAvailable(roomId);
        
        if (success) {
            return ResponseEntity.ok().body(Map.of(
                "message", "Room marked as available",
                "roomId", roomId
            ));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}