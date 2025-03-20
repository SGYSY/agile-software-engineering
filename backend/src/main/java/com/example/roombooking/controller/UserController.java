package com.example.roombooking.controller;

import com.example.roombooking.dto.UserDTO;
import com.example.roombooking.entity.User;
import com.example.roombooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO userdto) {
        // 检查用户名和邮箱是否已存在
        if (userService.existsByUsername(userdto.getUsername())) {
            System.out.println("Username already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        if (userService.existsByEmail(userdto.getEmail())) {
            System.out.println("Email already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user = new User();
        user.setUsername(userdto.getUsername());
        user.setEmail(userdto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userdto.getPassword()));
        User savedUser = userService.saveUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        Optional<User> existingUserOpt = userService.getUserById(id);
        if (existingUserOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = existingUserOpt.get();
        
        // 只更新不为空的字段，避免覆盖旧值
        if (user.getUsername() != null) existingUser.setUsername(user.getUsername());
        if (user.getFirstName() != null) existingUser.setFirstName(user.getFirstName());
        if (user.getLastName() != null) existingUser.setLastName(user.getLastName());
        if (user.getEmail() != null) existingUser.setEmail(user.getEmail());
        if (user.getPhoneNumber() != null) existingUser.setPhoneNumber(user.getPhoneNumber());
        if (user.getRole() != null) existingUser.setRole(user.getRole());
        if (user.getPasswordHash() != null && !user.getPasswordHash().isBlank()) {
            existingUser.setPasswordHash(user.getPasswordHash()); // 交给 `saveUser()` 处理
        }

        User updatedUser = userService.saveUser(existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}