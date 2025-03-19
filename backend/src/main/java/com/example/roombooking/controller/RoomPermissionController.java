package com.example.roombooking.controller;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.RoomPermission;
import com.example.roombooking.service.RoomPermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/room-permissions")
@CrossOrigin(origins = "*")
public class RoomPermissionController {

    @Autowired
    private RoomPermissionService roomPermissionService;
    
    @GetMapping
    public ResponseEntity<List<RoomPermission>> getAllPermissions() {
        return ResponseEntity.ok(roomPermissionService.getAllPermissions());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RoomPermission> getPermissionById(@PathVariable Long id) {
        Optional<RoomPermission> permission = roomPermissionService.getPermissionById(id);
        return permission.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/room/{roomId}")
    public ResponseEntity<List<RoomPermission>> getPermissionsByRoom(@PathVariable Long roomId) {
        List<RoomPermission> permissions = roomPermissionService.getPermissionsByRoom(roomId);
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<RoomPermission>> getPermissionsByRole(@PathVariable Long roleId) {
        List<RoomPermission> permissions = roomPermissionService.getPermissionsByRole(roleId);
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RoomPermission>> getPermissionsByUser(@PathVariable Long userId) {
        List<RoomPermission> permissions = roomPermissionService.getPermissionsByUser(userId);
        return ResponseEntity.ok(permissions);
    }
    
    @GetMapping("/check-access/{userId}/{roomId}")
    public ResponseEntity<Boolean> checkUserAccess(@PathVariable Long userId, @PathVariable Long roomId) {
        boolean hasAccess = roomPermissionService.canUserAccessRoom(userId, roomId);
        return ResponseEntity.ok(hasAccess);
    }
    
    @GetMapping("/accessible-rooms/{userId}")
    public ResponseEntity<List<Room>> getAccessibleRooms(@PathVariable Long userId) {
        List<Room> rooms = roomPermissionService.getAccessibleRoomsForUser(userId);
        return ResponseEntity.ok(rooms);
    }
    
    @PostMapping
    public ResponseEntity<RoomPermission> addPermission(@RequestBody RoomPermission permission) {
        RoomPermission createdPermission = roomPermissionService.addPermission(permission);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPermission);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RoomPermission> updatePermission(@PathVariable Long id, @RequestBody RoomPermission permission) {
        RoomPermission updatedPermission = roomPermissionService.updatePermission(id, permission);
        if (updatedPermission == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPermission);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        if (roomPermissionService.getPermissionById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        roomPermissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }
}