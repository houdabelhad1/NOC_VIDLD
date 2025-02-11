package com.hbdev.gatewayservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Configuration
public class CorsConfig {

    @Bean
    public WebFilter corsFilter() {
        return (ServerWebExchange exchange, WebFilterChain chain) -> {
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Credentials", "true");
            return chain.filter(exchange);
        };
    }
}
