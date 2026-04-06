package com.example.doctorappointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.doctorappointment.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}