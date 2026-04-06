package com.example.doctorappointment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import com.example.doctorappointment.entity.Appointment;
import com.example.doctorappointment.repository.AppointmentRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // CREATE APPOINTMENT
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // GET ALL APPOINTMENTS
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // GET APPOINTMENTS BY PATIENT ID
    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    // GET APPOINTMENTS BY DOCTOR ID
    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    // UPDATE STATUS 
    public Appointment updateStatus(Long id, String status) {

        Appointment appointment = appointmentRepository.findById(id).orElse(null);

        if (appointment != null) {
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }

        return null;
    }
}