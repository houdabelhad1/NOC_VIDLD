package com.hbdev.myllama;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication

public class MyLlamaApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyLlamaApplication.class, args);
    }

}
