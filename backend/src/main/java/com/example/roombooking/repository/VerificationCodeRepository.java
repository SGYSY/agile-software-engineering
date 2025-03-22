package com.example.roombooking.repository;

import com.example.roombooking.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    
    // 查找有效的验证码 (未使用且未过期)
    Optional<VerificationCode> findByEmailAndCodeAndUsedFalse(String email, String code);
    
    // 修改为返回List而不是Optional
    @Query("SELECT v FROM VerificationCode v WHERE v.email = :email AND v.used = false " +
           "ORDER BY v.expiryTime DESC")
    List<VerificationCode> findLatestValidByEmail(@Param("email") String email);
    
    // 清理过期验证码
    @Query("DELETE FROM VerificationCode v WHERE v.expiryTime < :now OR v.used = true")
    void deleteExpiredCodes(@Param("now") LocalDateTime now);
}