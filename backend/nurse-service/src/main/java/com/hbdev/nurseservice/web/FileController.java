package com.hbdev.nurseservice.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileController implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapping des fichiers statiques
        registry.addResourceHandler("/profimg/**")
                .addResourceLocations("file:C:/Users/HoudHoud Belhad/Documents/data_nurse/profimg/");
        System.out.println("Resource handler configured for /profimg/**");
    }
}
