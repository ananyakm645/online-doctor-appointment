package com.example.doctorappointment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.doctorappointment.entity.Appointment;
import com.example.doctorappointment.entity.User;
import com.example.doctorappointment.repository.AppointmentRepository;

import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // ✅ CREATE APPOINTMENT
    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        appointment.setStatus("PENDING");
        return appointmentRepository.save(appointment);
    }

    // ✅ PATIENT HISTORY (NO CHANGE)
    @GetMapping("/my")
    public List<Appointment> getMyAppointments(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return appointmentRepository.findByPatientId(user.getId());
    }

    // 🔥 DOCTOR FETCH
    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorAppointments(@PathVariable Long doctorId,
                                                   Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        if (!user.getId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized ❌");
        }

        return appointmentRepository.findByDoctorId(doctorId);
    }

    // 🔥🔥🔥 ADD THIS METHOD (APPROVE / REJECT FIX)
    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id,
                                   @RequestParam String status,
                                   Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        Appointment appointment = appointmentRepository.findById(id).orElse(null);

        if (appointment == null) {
            throw new RuntimeException("Appointment not found ❌");
        }

        // ✅ only same doctor can update
        if (!appointment.getDoctorId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized ❌");
        }

        appointment.setStatus(status);

        return appointmentRepository.save(appointment);
    }
}