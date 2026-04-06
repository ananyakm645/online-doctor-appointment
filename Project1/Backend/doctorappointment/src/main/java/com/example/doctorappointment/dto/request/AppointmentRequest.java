package com.example.doctorappointment.dto.request;

import lombok.Data;

@Data
public class AppointmentRequest {
    private Long doctorId;
    private Long patientId;
    private String date;
    private String time;
    private String disease;
    private String treatment;
}