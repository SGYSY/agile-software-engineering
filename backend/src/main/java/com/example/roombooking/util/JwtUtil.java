package com.example.roombooking.util;

import com.example.roombooking.config.JwtConfig;
import com.example.roombooking.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Autowired
    private JwtConfig jwtConfig;

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        if (user.getRole() != null) {
            claims.put("role", user.getRole().getName());
        }
        claims.put("email", user.getEmail());
        
        return createToken(claims, user.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long now = System.currentTimeMillis();
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtConfig.getExpiration() * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    private Key getSigningKey() {
        // 使用Keys工具类生成安全密钥
        // 方法1: 直接从字符串生成足够长的密钥
        byte[] keyBytes = jwtConfig.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
        
        // 方法2: 使用Keys自动生成安全密钥（更推荐）
        // return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody();
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}