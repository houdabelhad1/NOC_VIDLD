/*package com.hbdev.userservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class webConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Autoriser toutes les routes
                .allowedOrigins("http://localhost:5173")  // Autoriser le frontend sur localhost:3000
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Autoriser certains types de requêtes
                .allowedHeaders("*");  // Autoriser tous les en-têtes
    }
}
*/