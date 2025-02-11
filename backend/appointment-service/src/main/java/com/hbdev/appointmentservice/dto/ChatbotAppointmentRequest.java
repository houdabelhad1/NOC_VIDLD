package com.hbdev.appointmentservice.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatbotAppointmentRequest {
    private String city;
    private Long patientId;
    private String date;
    private String time;
}