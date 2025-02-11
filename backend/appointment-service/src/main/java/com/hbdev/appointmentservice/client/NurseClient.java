package com.hbdev.appointmentservice.client;

import lombok.Getter;
import lombok.Setter;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "nurse-service", url = "http://localhost:8082")
public interface NurseClient {

    @GetMapping("/api/nurses/{id}") // récupérer un nurse par son ID
    NurseResponse getNurseById(@PathVariable Long id);
    @GetMapping("/api/nurses/by-city/{city}")
    List<NurseResponse> getNursesByCity(@PathVariable String city);
    @Getter
    @Setter
    class NurseResponse {
        private Long id;
        private String name;
        private String geographicArea;
    }
}