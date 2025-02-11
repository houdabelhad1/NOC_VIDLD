package com.hbdev.myllama.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@Service
public class MyLlamaService {

    private static final String LLAMA_URL = "http://127.0.0.1:1234/v1/completions";
    public String getHealthAdvice(String question) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> request = new HashMap<>();
        request.put("prompt", question);
        request.put("max_tokens", 150);

        // Envoie la requête à LLAMA
        Map<String, Object> response = restTemplate.postForObject(LLAMA_URL, request, Map.class);

        // Traite la réponse et renvoie la réponse de LLAMA
        return response != null ? response.get("choices").toString() : "Pas de réponse de l'IA.";
    }
}
