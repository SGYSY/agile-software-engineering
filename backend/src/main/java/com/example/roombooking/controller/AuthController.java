package com.example.roombooking.controller;

import com.example.roombooking.dto.AuthRequest;
import com.example.roombooking.dto.AuthResponse;
import com.example.roombooking.dto.EmailVerificationRequest;
import com.example.roombooking.dto.FullAuthRequest;
import com.example.roombooking.dto.VerifyCodeRequest;
import com.example.roombooking.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    /**
     * 用户名密码登录
     * @param request 登录请求
     * @return 登录成功返回token等信息，失败返回错误信息
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        
        if (response == null) {
            return ResponseEntity.badRequest().body("用户名或密码错误");
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * 请求发送验证码
     * @param request 请求体，包含邮箱
     * @return 发送结果
     */
    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailVerificationRequest request) {
        boolean sent = authService.requestVerificationCode(request.getEmail());
        
        if (!sent) {
            return ResponseEntity.badRequest().body("发送验证码失败，请检查邮箱是否正确或稍后再试");
        }
        
        return ResponseEntity.ok("验证码已发送到您的邮箱，有效期10分钟");
    }
    
    /**
     * 通过验证码登录
     * @param request 包含邮箱和验证码的请求
     * @return 登录成功返回token等信息，失败返回错误信息
     */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        AuthResponse response = authService.verifyCodeAndLogin(request.getEmail(), request.getCode());
        
        if (response == null) {
            return ResponseEntity.badRequest().body("验证码无效或已过期");
        }
        
        return ResponseEntity.ok(response);
    }


    /**
     * 三重验证登录 - 邮箱+密码+验证码
     * @param request 包含邮箱、密码和验证码的请求
     * @return 登录成功返回token等信息，失败返回错误信息
     */
    @PostMapping("/full-login")
    public ResponseEntity<?> fullLogin(@RequestBody FullAuthRequest request) {
        AuthResponse response = authService.fullAuthenticate(request);
        
        if (response == null) {
            return ResponseEntity.badRequest().body("登录失败，请检查邮箱、密码和验证码是否正确");
        }
        
        return ResponseEntity.ok(response);
    }
}