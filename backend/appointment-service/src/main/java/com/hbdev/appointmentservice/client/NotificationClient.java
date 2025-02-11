package com.hbdev.appointmentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "notification-service", url = "http://localhost:8084")
public interface NotificationClient {

    @PostMapping("/api/notifications")
    void createNotification(
            @RequestParam Long userId, // ID de l'utilisateur
            @RequestParam String message // Message de la notification
    );
}
