package com.example.roombooking.service;

import com.example.roombooking.dto.AuthRequest;
import com.example.roombooking.dto.AuthResponse;
import com.example.roombooking.entity.User;
import com.example.roombooking.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private VerificationCodeService verificationCodeService;
    
    /**
     * 用户名密码登录
     * @param request 包含用户名和密码的请求
     * @return 认证成功返回AuthResponse，失败返回null
     */
    public AuthResponse authenticate(AuthRequest request) {
        Optional<User> userOptional = userService.getUserByUsername(request.getUsername());
        
        if (userOptional.isEmpty()) {
            logger.info("登录失败：用户名不存在 - {}", request.getUsername());
            return null; // 用户不存在
        }
        
        User user = userOptional.get();
        
        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            logger.info("登录失败：密码错误 - {}", request.getUsername());
            return null; // 密码错误
        }
        
        logger.info("用户 {} 登录成功", user.getUsername());
        return generateAuthResponse(user);
    }
    
    /**
     * 请求发送验证码
     * @param email 邮箱地址
     * @return 如果发送成功返回true，否则返回false
     */
    public boolean requestVerificationCode(String email) {
        logger.info("用户请求发送验证码到邮箱: {}", email);
        return verificationCodeService.sendVerificationCode(email);
    }
    
    /**
     * 验证码登录
     * @param email 邮箱
     * @param code 验证码
     * @return 验证成功返回AuthResponse，失败返回null
     */
    public AuthResponse verifyCodeAndLogin(String email, String code) {
        Optional<User> userOptional = verificationCodeService.verifyCode(email, code);
        
        if (userOptional.isEmpty()) {
            logger.info("验证码登录失败: 邮箱={}", email);
            return null; // 验证码无效或已过期
        }
        
        User user = userOptional.get();
        logger.info("用户 {} 通过验证码登录成功", user.getUsername());
        return generateAuthResponse(user);
    }
    
    /**
     * 生成认证响应
     * @param user 用户
     * @return 认证响应
     */
    private AuthResponse generateAuthResponse(User user) {
        // 生成JWT令牌
        String token = jwtUtil.generateToken(user);
        
        // 获取角色名（如果存在）
        String roleName = (user.getRole() != null) ? user.getRole().getName() : "user";
        
        return new AuthResponse(token, user.getId(), user.getUsername(), roleName);
    }
}