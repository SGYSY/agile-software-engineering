package com.example.roombooking.service;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.RoomPermission;
import com.example.roombooking.entity.User;
import com.example.roombooking.repository.RoomPermissionRepository;
import com.example.roombooking.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomPermissionService {

    @Autowired
    private RoomPermissionRepository roomPermissionRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    public List<RoomPermission> getAllPermissions() {
        return roomPermissionRepository.findAll();
    }
    
    public Optional<RoomPermission> getPermissionById(Long id) {
        return roomPermissionRepository.findById(id);
    }
    
    public List<RoomPermission> getPermissionsByRoom(Long roomId) {
        return roomPermissionRepository.findByRoomId(roomId);
    }
    
    public List<RoomPermission> getPermissionsByRole(Long roleId) {
        return roomPermissionRepository.findByRoleId(roleId);
    }
    
    public List<RoomPermission> getPermissionsByUser(Long userId) {
        return roomPermissionRepository.findByUserId(userId);
    }
    
    public boolean canUserAccessRoom(Long userId, Long roomId) {
        List<RoomPermission> permissions = roomPermissionRepository.checkUserAccessToRoom(userId, roomId);
        return !permissions.isEmpty();
    }
    
    public List<Room> getAccessibleRoomsForUser(Long userId) {
        List<Object[]> results = roomPermissionRepository.findAccessibleRoomsForUser(userId);

        return results.stream()
            .map(result -> {
                Long roomId = ((Number)result[0]).longValue();
                return roomRepository.findById(roomId).orElse(null);
            })
            .filter(room -> room != null)
            .collect(Collectors.toList());
    }
    
    public RoomPermission addPermission(RoomPermission permission) {
        return roomPermissionRepository.save(permission);
    }
    
    public RoomPermission updatePermission(Long id, RoomPermission permission) {
        if (!roomPermissionRepository.existsById(id)) {
            return null;
        }
        
        permission.setId(id);
        return roomPermissionRepository.save(permission);
    }
    
    public void deletePermission(Long id) {
        roomPermissionRepository.deleteById(id);
    }
}