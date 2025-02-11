package com.hbdev.nurseservice.client;

import lombok.Getter;
import lombok.Setter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service",url = "http://localhost:8080/api/auth")
public interface UserClient {
    @GetMapping("/{id}")
    UserResponse getUserById(@PathVariable("id") Long userId);
    @Getter
    @Setter
    class UserResponse {
        private Long id;
        private String email;
        private String role;
    }
}
