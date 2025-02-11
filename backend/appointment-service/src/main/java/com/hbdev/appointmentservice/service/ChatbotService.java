package com.hbdev.appointmentservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hbdev.appointmentservice.dto.ChatbotResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class ChatbotService {

    private static final Logger LOGGER = Logger.getLogger(ChatbotService.class.getName());
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${llama.api.url}")
    private String llamaApiUrl;

    public ChatbotResponse processUserRequest(String userMessage) {
        String prompt = buildStructuredPrompt(userMessage);

        try {
            // Envoi de la requête à LM Studio
            String llamaResponse = restTemplate.postForObject(
                    llamaApiUrl,
                    buildLlamaRequest(prompt),
                    String.class
            );

            return parseLlamaResponse(llamaResponse);
        } catch (Exception e) {
            LOGGER.severe("Erreur lors de l'appel à LM Studio : " + e.getMessage());
            return new ChatbotResponse("error", "Impossible de traiter la requête");
        }
    }

    private String buildStructuredPrompt(String userInput) {
        return String.format(
                "Extract following details from this user request in FRENCH in JSON format (city, date, time, patientId):\n" +
                        "User request: \"%s\"\n" +
                        "JSON response:",
                userInput
        );
    }

    private Object buildLlamaRequest(String prompt) {
        return Map.of(
                "prompt", prompt,
                "temperature", 0.7,
                "max_tokens", 500
        );
    }

    private ChatbotResponse parseLlamaResponse(String response) {
        try {
            JsonNode root = objectMapper.readTree(response);

            String city = extractJsonValue(root, "city");
            String dateStr = extractJsonValue(root, "date");
            String time = extractJsonValue(root, "time");
            String patientId = extractJsonValue(root, "patientId");

            String isoDate = dateStr != null ? convertDateToIso(dateStr) : null;

            return new ChatbotResponse(city, isoDate, time, patientId);
        } catch (Exception e) {
            LOGGER.severe("Erreur lors du parsing de la réponse Llama: " + e.getMessage());
            return new ChatbotResponse("error", "Format de réponse incorrect");
        }
    }

    private String extractJsonValue(JsonNode root, String field) {
        return Optional.ofNullable(root.path(field))
                .filter(JsonNode::isTextual)
                .map(JsonNode::asText)
                .orElse(null);
    }

    private String convertDateToIso(String dateStr) {
        try {
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.FRENCH);
            DateTimeFormatter outputFormatter = DateTimeFormatter.ISO_LOCAL_DATE;

            LocalDate date = LocalDate.parse(dateStr, inputFormatter);
            return date.format(outputFormatter);
        } catch (Exception e) {
            LOGGER.warning("Impossible de convertir la date: " + dateStr);
            return null;
        }
    }
}
