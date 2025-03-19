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
    
    /**
     * 发送简单邮件
     * @param to 收件人
     * @param subject 主题
     * @param text 内容
     */
    public void sendEmail(String to, String subject, String text) {
        if (mailSender == null) {
            logger.warn("邮件服务未配置，无法发送邮件到: {}", to);
            return;
        }
        
        try {
            logger.info("准备发送邮件，发件人: {}, 收件人: {}", fromEmail, to);
            
            SimpleMailMessage message = new SimpleMailMessage();
            // 确保发件人地址与授权用户完全一致 - 不添加任何额外格式
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("邮件已成功发送至: {}", to);
        } catch (Exception e) {
            logger.error("发送邮件失败: {}", e.getMessage(), e);  // 添加完整堆栈跟踪
        }
    }
    
    /**
     * 发送验证码邮件
     * @param email 收件人邮箱
     * @param code 验证码
     */
    public void sendVerificationCode(String email, String code) {
        String subject = "Room Booking System - 登录验证码";
        String text = "尊敬的用户：\n\n您的登录验证码是: " + code 
                + "。\n该验证码10分钟内有效，请勿泄露给他人。\n\n"
                + "如果这不是您的操作，请忽略此邮件。\n\n"
                + "Room Booking System 团队";
        sendEmail(email, subject, text);
    }
}