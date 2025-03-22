package com.example.roombooking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.secret:defaultsecretkey01234567890123456789012345678901}")
    private String secret;

    @Value("${jwt.expiration:86400}")
    private long expiration;

    public String getSecret() {
        return secret;
    }

    public long getExpiration() {
        return expiration;
    }
}