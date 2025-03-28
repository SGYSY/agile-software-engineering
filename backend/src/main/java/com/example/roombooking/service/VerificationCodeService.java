package com.example.roombooking.service;

import com.example.roombooking.entity.User;
import com.example.roombooking.entity.VerificationCode;
import com.example.roombooking.repository.UserRepository;
import com.example.roombooking.repository.VerificationCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class VerificationCodeService {

    private static final Logger logger = LoggerFactory.getLogger(VerificationCodeService.class);

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Length of the verification code (6-digit)
    private static final int CODE_LENGTH = 6;

    // Code validity duration in minutes
    private static final int EXPIRY_MINUTES = 10;

    // Minimum interval (in seconds) between two code requests
    private static final int COOLDOWN_SECONDS = 60;

    // Generate a random 6-digit numeric code
    private String generateRandomCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    // Send verification code to the specified email address
    public boolean sendVerificationCode(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            logger.warn("Trying to send a verification code for a non-existent mailbox: {}", email);
            return false;
        }

        try {
            // Check for cooldown
            List<VerificationCode> latestCodes = verificationCodeRepository.findLatestValidByEmail(email);

            if (!latestCodes.isEmpty()) {
                VerificationCode latestCode = latestCodes.get(0);
                // Ensure at least COOLDOWN_SECONDS have passed since the last code was issued
                if (LocalDateTime.now().isBefore(
                        latestCode.getExpiryTime().minusMinutes(EXPIRY_MINUTES).plusSeconds(COOLDOWN_SECONDS))) {
                    logger.info("Email {} Trying to get verification code during cooldown", email);
                    return false;
                }
            }

            // Generate and store a new verification code
            String code = generateRandomCode();
            VerificationCode verificationCode = new VerificationCode();
            verificationCode.setEmail(email);
            verificationCode.setCode(code);
            verificationCode.setExpiryTime(LocalDateTime.now().plusMinutes(EXPIRY_MINUTES));
            verificationCode.setUsed(false);

            verificationCodeRepository.save(verificationCode);
            logger.info("Generate a captCHA for the mailbox {}: {}", email, code);

            // Send the code via email
            try {
                emailService.sendVerificationCode(email, code);
                return true;
            } catch (Exception e) {
                logger.error("Failed to send the verification code. Procedure: {}", e.getMessage());
                return true; // Code is generated even if email fails
            }

        } catch (Exception e) {
            logger.error("An error occurred while generating the verification code: {}", e.getMessage(), e);
            return false;
        }
    }

    // For testing: get the latest unexpired code for an email
    public String getLatestCodeForTesting(String email) {
        List<VerificationCode> codes = verificationCodeRepository.findLatestValidByEmail(email);
        return codes.isEmpty() ? null : codes.get(0).getCode();
    }

    // Verify the submitted code for the specified email
    public Optional<User> verifyCode(String email, String code) {
        Optional<VerificationCode> verificationCodeOpt = verificationCodeRepository.findByEmailAndCodeAndUsedFalse(email, code);

        if (verificationCodeOpt.isPresent()) {
            VerificationCode verificationCode = verificationCodeOpt.get();

            if (LocalDateTime.now().isBefore(verificationCode.getExpiryTime())) {
                // Mark code as used and return associated user
                verificationCode.setUsed(true);
                verificationCodeRepository.save(verificationCode);
                logger.info("Mailbox {} authentication succeeded", email);

                return userRepository.findByEmail(email);
            } else {
                logger.info("The verification code submitted by email {} has expired", email);
            }
        } else {
            logger.info("The verification code submitted by email {} is invalid", email);
        }

        return Optional.empty();
    }

    // Scheduled task to clean up expired verification codes daily at 2:00 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredCodes() {
        verificationCodeRepository.deleteExpiredCodes(LocalDateTime.now());
        logger.info("Expired verification codes have been cleared. Procedure");
    }
}
