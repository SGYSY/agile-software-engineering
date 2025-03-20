package com.example.roombooking.repository;

import com.example.roombooking.entity.RoomPermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomPermissionRepository extends JpaRepository<RoomPermission, Long> {
    @Query(value = "SELECT * FROM room_permission WHERE room_id = :roomId", nativeQuery = true)
    List<RoomPermission> findByRoomId(@Param("roomId") Long roomId);
    
    @Query(value = "SELECT * FROM room_permission WHERE role_id = :roleId", nativeQuery = true)
    List<RoomPermission> findByRoleId(@Param("roleId") Long roleId);
    
    @Query(value = "SELECT * FROM room_permission WHERE user_id = :userId", nativeQuery = true)
    List<RoomPermission> findByUserId(@Param("userId") Long userId);
    
    @Query(value = "SELECT rp.* FROM room_permission rp " +
           "JOIN users u ON u.user_id = :userId " +
           "WHERE (rp.role_id = u.role_id OR rp.user_id = u.user_id) " +
           "AND rp.room_id = :roomId", nativeQuery = true)
    List<RoomPermission> checkUserAccessToRoom(@Param("userId") Long userId, @Param("roomId") Long roomId);
    
    @Query(value = "SELECT r.* FROM rooms r " +
           "JOIN room_permission rp ON r.room_id = rp.room_id " +
           "JOIN users u ON u.user_id = :userId " +
           "WHERE (rp.role_id = u.role_id OR rp.user_id = :userId) " +
           "AND r.available = true", nativeQuery = true)
    List<Object[]> findAccessibleRoomsForUser(@Param("userId") Long userId);
}