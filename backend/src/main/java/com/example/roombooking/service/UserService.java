package com.example.roombooking.service;

import com.example.roombooking.entity.User;
import com.example.roombooking.repository.RoleRepository;
import com.example.roombooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User saveUser(User user) {
        if (user.getId() == null) {  
            // 创建用户时，如果密码不是哈希格式，则进行加密
            if (user.getPasswordHash() != null && !user.getPasswordHash().startsWith("$2a$")) {
                user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
            }
        } else {  
            // 更新用户时，避免密码被覆盖成明文
            Optional<User> existingUser = userRepository.findById(user.getId());
            if (existingUser.isPresent()) {
                // 如果请求体中的密码为空，则保持原密码
                if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
                    user.setPasswordHash(existingUser.get().getPasswordHash());
                } else if (!user.getPasswordHash().startsWith("$2a$")) {
                    // 只有当密码不是哈希格式时，才进行加密
                    user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
                }
            }
        }
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

}