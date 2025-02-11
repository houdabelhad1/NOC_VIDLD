package com.hbdev.notificationservice.repository;

import com.hbdev.notificationservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    //notifications par ID d'utilisateur
    List<Notification> findByUserId(Long userId);

    //notifications non lues par ID d'utilisateur
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}