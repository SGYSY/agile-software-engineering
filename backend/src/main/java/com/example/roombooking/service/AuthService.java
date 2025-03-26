package com.example.roombooking.service;

import com.example.roombooking.dto.AuthRequest;
import com.example.roombooking.dto.AuthResponse;
import com.example.roombooking.dto.FullAuthRequest;
import com.example.roombooking.entity.User;
import com.example.roombooking.entity.VerificationCode;
import com.example.roombooking.repository.VerificationCodeRepository;
import com.example.roombooking.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    public AuthResponse authenticate(AuthRequest request) {
        Optional<User> userOptional = userService.getUserByUsername(request.getUsername());
        
        if (userOptional.isEmpty()) {
            logger.info("Login failed: The user name does not exist - {}", request.getUsername());
            return null;
        }
        
        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            logger.info("Login failure: The password is incorrect - {}", request.getUsername());
            return null;
        }
        
        logger.info("User {} logged in successfully", user.getUsername());
        return generateAuthResponse(user);
    }

    public boolean requestVerificationCode(String email) {
        logger.info("The user requests to send the verification code to the email address: {}", email);
        return verificationCodeService.sendVerificationCode(email);
    }

    public AuthResponse verifyCodeAndLogin(String email, String code) {
        Optional<User> userOptional = verificationCodeService.verifyCode(email, code);
        
        if (userOptional.isEmpty()) {
            logger.info("Verification code Login failure: Email={}", email);
            return null;
        }
        
        User user = userOptional.get();
        logger.info("User {} successfully logs in using the verification code", user.getUsername());
        return generateAuthResponse(user);
    }

    private AuthResponse generateAuthResponse(User user) {
        String token = jwtUtil.generateToken(user);

        String roleName = (user.getRole() != null) ? user.getRole().getName() : "user";
        
        return new AuthResponse(token, user.getId(), user.getUsername(), roleName);
    }


    public AuthResponse fullAuthenticate(FullAuthRequest request) {
        Optional<User> userOptional = userService.getUserByEmail(request.getEmail());
        
        if (userOptional.isEmpty()) {
            logger.info("Login failed: The mailbox does not exist - {}", request.getEmail());
            return null;
        }
        
        User user = userOptional.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            logger.info("Login failure: The password is incorrect - {}", request.getEmail());
            return null;
        }

        Optional<VerificationCode> verificationCodeOpt = 
            verificationCodeRepository.findByEmailAndCodeAndUsedFalse(request.getEmail(), request.getCode());
        
        if (verificationCodeOpt.isEmpty()) {
            logger.info("Login failed: The verification code is invalid - {}", request.getEmail());
            return null;
        }
        
        VerificationCode verificationCode = verificationCodeOpt.get();

        if (LocalDateTime.now().isAfter(verificationCode.getExpiryTime())) {
            logger.info("Login failure: The verification code has expired - {}", request.getEmail());
            return null;
        }

        verificationCode.setUsed(true);
        verificationCodeRepository.save(verificationCode);
        
        logger.info("User {} successfully logs in through triple authentication", user.getUsername());
        return generateAuthResponse(user);
    }

}