package com.example.doctorappointment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.doctorappointment.dto.request.LoginRequest;
import com.example.doctorappointment.dto.request.RegisterRequest;
import com.example.doctorappointment.entity.User;
import com.example.doctorappointment.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = authService.register(request);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already exists ❌");
        }

        return ResponseEntity.ok(user);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        String token = authService.login(request);

        if (token == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid credentials ❌");
        }

        return ResponseEntity.ok(token);
    }
}