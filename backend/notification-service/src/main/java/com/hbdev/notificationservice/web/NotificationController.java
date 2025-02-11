package com.hbdev.notificationservice.web;

import com.hbdev.notificationservice.entity.Notification;
import com.hbdev.notificationservice.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestParam Long userId,
            @RequestParam String message) {
        Notification notification = notificationService.createNotification(userId, message);
        return ResponseEntity.ok(notification);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUserId(
            @PathVariable Long userId
    ) {
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        return ResponseEntity.ok(notifications); // lst des notifications
    }


    @PatchMapping("/{notificationId}/mark-as-read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long notificationId
    ) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build(); // Retourne un statut 204 (No Content)
    }


    @RequestMapping(value = "/{notificationId}/mark-as-read", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.noContent().build(); // Répondre avec un statut 204 (No Content)
    }
}