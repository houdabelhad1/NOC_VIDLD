package com.hbdev.nurseservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients(basePackages = "com.hbdev.nurseservice.client")
@SpringBootApplication
public class NurseServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NurseServiceApplication.class, args);
    }

}
