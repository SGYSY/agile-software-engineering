package com.example.roombooking.dto;

import lombok.Data;

@Data
public class FullAuthRequest {
    private String email;
    private String password;
    private String code;
}