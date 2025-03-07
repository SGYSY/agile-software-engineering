package com.example.roombooking.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.security.Principal;

@RestController
public class AuthController {

    @GetMapping("/auth/microsoft")
    public void redirectToMicrosoft(HttpServletResponse response) throws IOException {
        // Spring Security 默认的OAuth2 Client登陆地址:
        // /oauth2/authorization/你的注册名(此处是 "microsoft")
        System.out.println("aaa");
        response.sendRedirect("http://localhost:8080/login/oauth2/code/microsoft");
    }
    @GetMapping("/home")
    public String home(Principal principal) {
        // principal里如果已经登录，会包含用户信息
        return "Welcome, " + principal.getName();
    }

    @GetMapping("/test")
    public String test(@AuthenticationPrincipal OAuth2User userInfo) {
        return "";
    }

}
