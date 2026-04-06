package com.example.doctorappointment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.doctorappointment.entity.User;
import com.example.doctorappointment.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ 1. GET ALL USERS (THIS WAS MISSING ❌)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ 2. GET LOGGED-IN USER
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        user.setPassword(null);

        return ResponseEntity.ok(user);
    }
}