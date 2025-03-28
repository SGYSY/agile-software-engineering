package com.example.roombooking.service;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.RoomIssue;
import com.example.roombooking.repository.RoomIssueRepository;
import com.example.roombooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomIssueService {

    @Autowired
    private RoomIssueRepository roomIssueRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    public List<RoomIssue> getAllIssues() {
        return roomIssueRepository.findAll();
    }
    
    public Optional<RoomIssue> getIssueById(Long id) {
        return roomIssueRepository.findById(id);
    }
    
    public List<RoomIssue> getIssuesByRoom(Long roomId) {
        return roomIssueRepository.findIssuesByRoomId(roomId);
    }
    
    public RoomIssue reportIssue(RoomIssue issue) {
        Room room = roomRepository.findById(issue.getRoom().getId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        issue.setRoom(room);
        
        return roomIssueRepository.save(issue);
    }
    
    public RoomIssue updateIssue(Long id, RoomIssue issue) {
        if (!roomIssueRepository.existsById(id)) {
            return null;
        }
        
        issue.setId(id);
        return roomIssueRepository.save(issue);
    }
    
    public void deleteIssue(Long id) {
        roomIssueRepository.deleteById(id);
    }
    
    public int getIssueCountByRoom(Long roomId) {
        return roomIssueRepository.countIssuesByRoomId(roomId);
    }

    public boolean markRoomUnderMaintenance(Long roomId, String issueName, String description) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            return false;
        }
        
        Room room = roomOpt.get();
        
        // Create a maintenance issue record
        RoomIssue issue = new RoomIssue();
        issue.setRoom(room);
        issue.setIssueName(issueName != null ? issueName : "Under Maintenance");
        issue.setDescription(description);
        roomIssueRepository.save(issue);
        
        // Just mark the room as unavailable (maintenance status)
        room.setAvailable(false);
        roomRepository.save(room);
        
        return true;
    }
    
    // Mark room as available
    public boolean markRoomAvailable(Long roomId) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            return false;
        }
        
        Room room = roomOpt.get();
        
        // Mark room as available
        room.setAvailable(true);
        roomRepository.save(room);
        
        return true;
    }
}