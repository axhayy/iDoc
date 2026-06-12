package com.editor.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.editor.backend.dto.GoogleAuthRequest;
import com.editor.backend.dto.LoginRequest;
import com.editor.backend.dto.LoginResponse;
import com.editor.backend.dto.RegisterRequest;
import com.editor.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request) {

        return userService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);

    }

    @PostMapping("/google")
    public LoginResponse googleLogin(
            @RequestBody GoogleAuthRequest request) {

        return userService.googleLogin(
                request.getEmail(),
                request.getName()
        );
    }
}
