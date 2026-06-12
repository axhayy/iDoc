package com.editor.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.editor.backend.dto.LoginRequest;
import com.editor.backend.dto.LoginResponse;
import com.editor.backend.dto.RegisterRequest;
import com.editor.backend.entity.User;
import com.editor.backend.repository.UserRepository;
import com.editor.backend.security.JwtUtil;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // public String login(LoginRequest request) {
    //     Optional<User> userOptional
    //             = userRepository.findByEmail(request.getEmail());
    //     if (userOptional.isEmpty()) {
    //         return "User not found";
    //     }
    //     User user = userOptional.get();
    //     boolean matches
    //             = passwordEncoder.matches(
    //                     request.getPassword(),
    //                     user.getPassword()
    //             );
    //     if (!matches) {
    //         return "Invalid Password";
    //     }
    //     return "Login Successful";
    // }
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow();

        boolean matches
                = passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!matches) {
            throw new RuntimeException("Invalid Password");
        }

        String token
                = JwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token);
    }

    public String register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Encrypt password before saving
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public LoginResponse googleLogin(String email, String name) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            user = new User();

            user.setName(name);
            user.setEmail(email);

            user.setPassword(
                    passwordEncoder.encode("GOOGLE_USER")
            );

            userRepository.save(user);
        }

        String token
                = JwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token);
    }
}
