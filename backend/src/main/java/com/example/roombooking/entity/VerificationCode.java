package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_codes")
@Data
public class VerificationCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String code;
    
    @Column(nullable = false)
    private LocalDateTime expiryTime;
    
    @Column(nullable = false)
    private boolean used;
    
    // 验证码是否有效
    @Transient
    public boolean isValid() {
        return !used && LocalDateTime.now().isBefore(expiryTime);
    }
}