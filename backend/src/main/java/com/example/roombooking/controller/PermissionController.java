package com.example.roombooking.controller;

import com.example.roombooking.entity.Permission;
import com.example.roombooking.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/permissions")
@CrossOrigin(origins = "*")
public class PermissionController {

    @Autowired
    private PermissionRepository permissionRepository;

    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Permission> getPermissionById(@PathVariable Long id) {
        Optional<Permission> permission = permissionRepository.findById(id);
        return permission.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Permission> getPermissionByName(@PathVariable String name) {
        Optional<Permission> permission = permissionRepository.findByName(name);
        return permission.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Permission> createPermission(@RequestBody Permission permission) {
        Permission savedPermission = permissionRepository.save(permission);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPermission);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Permission> updatePermission(@PathVariable Long id, @RequestBody Permission permission) {
        if (!permissionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        permission.setId(id);
        Permission updatedPermission = permissionRepository.save(permission);
        return ResponseEntity.ok(updatedPermission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        if (!permissionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        permissionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}