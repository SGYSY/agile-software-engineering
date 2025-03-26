package com.example.roombooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            logger.warn("The mail service is not configured and cannot send emails to: {}", to);
            return;
        }
        
        try {
            logger.info("Ready to send message from: {}, recipient: {}", fromEmail, to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("The email was successfully sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send mail: {}", e.getMessage(), e);
        }
    }
    

    public void sendVerificationCode(String email, String code) {
        String subject = "Room Booking System - login verification code";
        String text = "Dear user:\n\nYour login verification code is: " + code
                + ".\nThe verification code is valid for 10 minutes. Do not disclose it to others\n" +
                "\n.\n\n"
                + "If this is not your action, please ignore this message.\n\n"
                + "Room Booking System Team";
        sendEmail(email, subject, text);
    }
}