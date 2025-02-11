package com.hbdev.notificationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "appointment-service", url = "http://localhost:8083")
public interface AppointmentClient {

    // tous les rendez-vous
    @GetMapping("/api/appointments")
    List<AppointmentResponse> getAllAppointments();

    // rendez-vous d'un infirmier
    @GetMapping("/api/appointments/nurse/{nurseId}")
    List<AppointmentResponse> getAppointmentsByNurseId(@PathVariable Long nurseId);


    public static class AppointmentResponse {
        private Long id;
        private Long nurseId;
        private Long patientId;
        private String date;
        private String time;
        private String status;

    }
}