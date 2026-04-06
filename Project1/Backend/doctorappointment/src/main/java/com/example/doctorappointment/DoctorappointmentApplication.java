package com.example.doctorappointment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.doctorappointment.repository")
@EntityScan(basePackages = "com.example.doctorappointment.entity")
public class DoctorappointmentApplication {

    public static void main(String[] args) {
        SpringApplication.run(DoctorappointmentApplication.class, args);
    }
}