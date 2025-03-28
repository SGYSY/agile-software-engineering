package com.example.roombooking.controller;

import com.example.roombooking.entity.User;
import com.example.roombooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<User>> getAllTeachers() {
        return ResponseEntity.ok(userService.getAllTeachers());
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
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
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

        if (user.getUsername() != null) existingUser.setUsername(user.getUsername());
        if (user.getFirstName() != null) existingUser.setFirstName(user.getFirstName());
        if (user.getLastName() != null) existingUser.setLastName(user.getLastName());
        if (user.getEmail() != null) existingUser.setEmail(user.getEmail());
        if (user.getPhoneNumber() != null) existingUser.setPhoneNumber(user.getPhoneNumber());
        if (user.getRole() != null) existingUser.setRole(user.getRole());
        if (user.getPasswordHash() != null && !user.getPasswordHash().isBlank()) {
            existingUser.setPasswordHash(user.getPasswordHash());
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

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
        @RequestParam(required = false) String username,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String firstName,
        @RequestParam(required = false) String lastName,
        @RequestParam(required = false) String schoolNumber,
        @RequestParam(required = false) String phoneNumber,
        @RequestParam(required = false) Long roleId) {
        
        try {
            System.out.println("Search user requirement - username: " + username + ", email: " + email +
                ", firstName: " + firstName + ", lastName: " + lastName + 
                ", schoolNumber: " + schoolNumber + ", phoneNumber: " + phoneNumber +
                ", roleId: " + roleId);

            List<User> resultUsers = userService.getAllUsers();
            int originalCount = resultUsers.size();

            if (username != null && !username.trim().isEmpty()) {
                final String searchUsername = username.toLowerCase().trim();
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getUsername() != null && 
                            user.getUsername().toLowerCase().contains(searchUsername))
                    .toList();
                System.out.println("After filtering by user name " + resultUsers.size() + " left");
            }

            if (email != null && !email.trim().isEmpty()) {
                final String searchEmail = email.toLowerCase().trim();
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getEmail() != null && 
                            user.getEmail().toLowerCase().contains(searchEmail))
                    .toList();
                System.out.println("After filtering by email " + resultUsers.size() + " left");
            }

            if (firstName != null && !firstName.trim().isEmpty()) {
                final String searchFirstName = firstName.toLowerCase().trim();
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getFirstName() != null && 
                            user.getFirstName().toLowerCase().contains(searchFirstName))
                    .toList();
                System.out.println("After filtering by first name " + resultUsers.size() + " left");
            }

            if (lastName != null && !lastName.trim().isEmpty()) {
                final String searchLastName = lastName.toLowerCase().trim();
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getLastName() != null && 
                            user.getLastName().toLowerCase().contains(searchLastName))
                    .toList();
                System.out.println("After filtering by last name " + resultUsers.size() + " left");
            }

            if (schoolNumber != null && !schoolNumber.trim().isEmpty()) {
                final String searchSchoolNumber = schoolNumber.trim();
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getSchoolNumber() != null && 
                            user.getSchoolNumber().contains(searchSchoolNumber))
                    .toList();
                System.out.println("After filtering by school number " + resultUsers.size() + " left");
            }

            if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
                final String searchPhoneNumber = phoneNumber.trim();
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getPhoneNumber() != null && 
                            user.getPhoneNumber().contains(searchPhoneNumber))
                    .toList();
                System.out.println("After filtering by phone number " + resultUsers.size() + " left");
            }

            if (roleId != null) {
                resultUsers = resultUsers.stream()
                    .filter(user -> user.getRole() != null && 
                            roleId.equals(user.getRole().getId()))
                    .toList();
                System.out.println("After filtering by user id " + resultUsers.size() + " left");
            }

            System.out.println("Total " + originalCount + " user(s) after filtering " + resultUsers.size() + " left");

            List<User> sanitizedUsers = resultUsers.stream().map(user -> {
                User sanitized = new User();
                sanitized.setId(user.getId());
                sanitized.setUsername(user.getUsername());
                sanitized.setEmail(user.getEmail());
                sanitized.setFirstName(user.getFirstName());
                sanitized.setLastName(user.getLastName());
                sanitized.setPhoneNumber(user.getPhoneNumber());
                sanitized.setSchoolNumber(user.getSchoolNumber());
                sanitized.setRole(user.getRole());
                return sanitized;
            }).toList();
            
            return ResponseEntity.ok(sanitizedUsers);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Search failed: " + e.getMessage());
        }
    }
}