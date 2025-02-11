package com.hbdev.appointmentservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatbotResponse {
    private String city;
    private String date;
    private String time;
    private Long patientId;
    private String status;
    private String message;

    public ChatbotResponse(String city, String isoDate, String time, String patientId) {
    }
    public ChatbotResponse(String status, String message) {
        this.status = status;
        this.message = message;
        this.city = null;
        this.date = null;
        this.time = null;
        this.patientId = null;
    }
}