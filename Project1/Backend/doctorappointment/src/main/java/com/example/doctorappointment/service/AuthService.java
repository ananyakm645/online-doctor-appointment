package com.example.doctorappointment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.doctorappointment.dto.request.LoginRequest;
import com.example.doctorappointment.dto.request.RegisterRequest;
import com.example.doctorappointment.entity.User;
import com.example.doctorappointment.repository.UserRepository;
import com.example.doctorappointment.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ REGISTER
    public User register(RegisterRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            return null;
        }

        if (userRepository.findByEmail(request.getEmail()) != null) {
            return null;
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 🔐 encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 🔥 FIX HERE (IMPORTANT)
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        } else {
            user.setRole("PATIENT"); // default fallback
        }

        return userRepository.save(user);
    }

    // ✅ LOGIN → return token
    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user != null &&
            passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            return jwtUtil.generateToken(user.getEmail(), user.getRole());
        }

        return null;
    }
}