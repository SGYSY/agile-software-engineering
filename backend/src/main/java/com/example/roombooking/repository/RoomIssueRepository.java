package com.example.roombooking.repository;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.RoomIssue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomIssueRepository extends JpaRepository<RoomIssue, Long> {
    List<RoomIssue> findByRoom(Room room);
    
    @Query(value = "SELECT * FROM room_issue WHERE room_id = :roomId", nativeQuery = true)
    List<RoomIssue> findIssuesByRoomId(@Param("roomId") Long roomId);
    
    @Query(value = "SELECT COUNT(*) FROM room_issue WHERE room_id = :roomId", nativeQuery = true)
    int countIssuesByRoomId(@Param("roomId") Long roomId);

    @Query(value = "SELECT * FROM room_issue WHERE room_id = :roomId", nativeQuery = true)
    List<RoomIssue> findByRoomId(@Param("roomId") Long roomId);
}