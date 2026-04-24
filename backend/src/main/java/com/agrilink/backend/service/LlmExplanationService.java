package com.agrilink.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LlmExplanationService {

    @Value("${app.llm.enabled:true}")
    private boolean llmEnabled;

    @Value("${app.llm.base-url:https://api.openai.com/v1/chat/completions}")
    private String baseUrl;

    @Value("${app.llm.api-key:}")
    private String apiKey;

    @Value("${app.llm.model:gpt-4o-mini}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(20))
            .build();

    public String generateExplanation(Map<String, Object> recommendation) {
        if (!llmEnabled) {
            return fallbackExplanation(recommendation);
        }

        try {
            String prompt = buildPrompt(recommendation);

            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("model", model);
            payload.put("temperature", 0.2);
            payload.put("max_tokens", 1000);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of(
                    "role", "system",
                    "content", "You are an agricultural assistant. Explain only the provided recommendation and give actual benefits statistics if available. Do not suggest new crops. Do not change land allocation. Use simple language.Avoid any formatting since it wont be carried in json response. Just plain text explanation."
            ));
            messages.add(Map.of(
                    "role", "user",
                    "content", prompt
            ));
            payload.put("messages", messages);

            String requestBody = objectMapper.writeValueAsString(payload);

            HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl))
                    .timeout(Duration.ofSeconds(40))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody));

            if (apiKey != null && !apiKey.isBlank()) {
                requestBuilder.header("Authorization", "Bearer " + apiKey.trim());
            }

            HttpResponse<String> response = httpClient.send(
                    requestBuilder.build(),
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return fallbackExplanation(recommendation);
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                return fallbackExplanation(recommendation);
            }

            JsonNode message = choices.get(0).path("message");
            String content = message.path("content").asText("");
            if (content.isBlank()) {
                return fallbackExplanation(recommendation);
            }

            return content.trim();
        } catch (Exception e) {
            return fallbackExplanation(recommendation);
        }
    }

    private String buildPrompt(Map<String, Object> recommendation) {
        String district = valueAsString(recommendation.get("district"));
        String season = valueAsString(recommendation.get("season"));
        String rainfallType = valueAsString(recommendation.get("rainfall_type"));
        String mainCrop = valueAsString(recommendation.get("main_crop"));
        Object recommendedCrops = recommendation.get("recommended_crops");
        Object landPlan = recommendation.get("land_plan");

        return """
                You are an agricultural assistant helping a farmer.

                Based on the following data:
                - District: %s
                - Season: %s
                - Rainfall: %s
                - Main crop: %s
                - Suggested crops: %s
                - Land distribution: %s

                Explain:
                1. Why these crops are suitable
                2. How to divide land
                3. Benefits like water saving, soil health, and practical value with statistics if available.

                Important rules:
                - Do not suggest any new crop
                - Do not change the land plan
                - Use simple and clear language
                """.formatted(
                district,
                season,
                rainfallType,
                mainCrop,
                String.valueOf(recommendedCrops),
                String.valueOf(landPlan)
        );
    }

    private String fallbackExplanation(Map<String, Object> recommendation) {
        String mainCrop = valueAsString(recommendation.get("main_crop"));
        String rainfallType = valueAsString(recommendation.get("rainfall_type"));
        Object recommendedCrops = recommendation.get("recommended_crops");
        Object landPlan = recommendation.get("land_plan");

        return "The recommendation is based on rainfall type " + rainfallType
                + " and season suitability. Main crop " + mainCrop
                + " is kept as the primary crop, and the suggested crops "
                + String.valueOf(recommendedCrops)
                + " are added as alternatives. Land plan: "
                + String.valueOf(landPlan) + ".";
    }

    private String valueAsString(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}