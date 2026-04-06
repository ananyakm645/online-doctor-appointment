package com.example.doctorappointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.doctorappointment.entity.Appointment;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // ✅ get appointments by patient
    List<Appointment> findByPatientId(Long patientId);

    // ✅ (optional future) get appointments by doctor
    List<Appointment> findByDoctorId(Long doctorId);
}