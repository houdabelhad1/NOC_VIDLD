package com.hbdev.appointmentservice.web;

import com.hbdev.appointmentservice.dto.ChatbotAppointmentRequest;
import com.hbdev.appointmentservice.dto.ChatbotResponse;
import com.hbdev.appointmentservice.entity.Appointment;
import com.hbdev.appointmentservice.service.ChatbotService;
import com.hbdev.appointmentservice.service.SchedulingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class SchedulingController {
    @Autowired
    ChatbotService chatbotService;

    @Autowired
    private SchedulingService schedulingService;

    public static class AppointmentRequest {
        private Long nurseId;
        private Long patientId;
        private String date;
        private String time;

        public Long getNurseId() { return nurseId; }
        public void setNurseId(Long nurseId) { this.nurseId = nurseId; }

        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        LocalDate appointmentDate = LocalDate.parse(request.getDate());
        LocalTime appointmentTime = LocalTime.parse(request.getTime());

        Appointment appointment = schedulingService.createAppointment(
                request.getNurseId(),
                request.getPatientId(),
                appointmentDate,
                appointmentTime
        );

        return ResponseEntity.ok(appointment);
    }
    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = schedulingService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }
    @PostMapping("/chatbot")
    public ResponseEntity<Appointment> createAppointmentViaChatbot(@RequestBody ChatbotAppointmentRequest request) {
        LocalDate appointmentDate = LocalDate.parse(request.getDate());
        LocalTime appointmentTime = LocalTime.parse(request.getTime());

        Appointment appointment = schedulingService.createAppointmentViaChatbot(
                request.getCity(),
                request.getPatientId(),
                appointmentDate,
                appointmentTime
        );

        return ResponseEntity.ok(appointment);
    }
    @PostMapping("/chatbot/request")
    public ResponseEntity<ChatbotResponse> handleChatbotRequest(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        ChatbotResponse chatbotResponse = chatbotService.processUserRequest(userMessage);

        if ("success".equals(chatbotResponse.getStatus())) {
            try {
                Appointment appointment = schedulingService.createAppointmentViaChatbot(
                        chatbotResponse.getCity(),
                        chatbotResponse.getPatientId(),
                        LocalDate.parse(chatbotResponse.getDate()),
                        LocalTime.parse(chatbotResponse.getTime())
                );
                chatbotResponse.setMessage("Rendez-vous confirmé avec succès !");
                return ResponseEntity.ok(chatbotResponse);
            } catch (Exception e) {
                chatbotResponse.setStatus("error");
                chatbotResponse.setMessage("Échec de la réservation : " + e.getMessage());
                return ResponseEntity.badRequest().body(chatbotResponse);
            }
        }
        return ResponseEntity.badRequest().body(chatbotResponse);
    }
}