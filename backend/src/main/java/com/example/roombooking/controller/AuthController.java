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

/**
 * Controller for handling authentication-related API endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Allow requests from any origin (CORS)
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Login using email and password.
     * @param request Contains email and password.
     * @return AuthResponse if successful, otherwise error message.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);

        if (response == null) {
            return ResponseEntity.badRequest().body("Account not found or password incorrect");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Send a verification code to the given email.
     * @param request Contains the email address.
     * @return Success or failure message.
     */
    @PostMapping("/send-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody EmailVerificationRequest request) {
        boolean sent = authService.requestVerificationCode(request.getEmail());

        if (!sent) {
            return ResponseEntity.badRequest().body("Sending verification code failed");
        }

        return ResponseEntity.ok("The verification code has been sent to your email. It is valid for 10 minutes.");
    }

    /**
     * Verify the submitted email and verification code.
     * @param request Contains email and code.
     * @return AuthResponse if successful, otherwise error message.
     */
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        AuthResponse response = authService.verifyCodeAndLogin(request.getEmail(), request.getCode());

        if (response == null) {
            return ResponseEntity.badRequest().body("The verification code is invalid or has expired.");
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Login using a combination of email, password, and verification code.
     * @param request Contains email, password, and code.
     * @return AuthResponse if successful, otherwise error message.
     */
    @PostMapping("/full-login")
    public ResponseEntity<?> fullLogin(@RequestBody FullAuthRequest request) {
        AuthResponse response = authService.fullAuthenticate(request);

        if (response == null) {
            return ResponseEntity.badRequest().body("Login failed");
        }

        return ResponseEntity.ok(response);
    }
}
