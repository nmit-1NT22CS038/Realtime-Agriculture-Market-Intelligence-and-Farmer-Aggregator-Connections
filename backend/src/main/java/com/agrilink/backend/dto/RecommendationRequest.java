package com.agrilink.backend.dto;

public record RecommendationRequest(
        String district,
        String season,
        String commodity,
        double landSize,
        Integer year
) {}